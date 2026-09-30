use std::fs;
use std::path::{Path, PathBuf};
use tauri_plugin_clipboard_manager::ClipboardExt;
use tauri_plugin_dialog::DialogExt;

const MAX_SAVE_BYTES: usize = 8 * 1024 * 1024;
// Clipboard writes cross the same webview trust boundary as save_json, so they get
// the same bound: enough for any realistic JSON payload, still not unbounded.
const MAX_COPY_BYTES: usize = MAX_SAVE_BYTES;

/// default_name crosses the webview trust boundary, so reduce it to a bare file
/// name: `Path::file_name` drops any directory component, and returns None for
/// "", "/" and "..", which fall back to a safe constant.
fn sanitize_default_name(name: &str) -> String {
    Path::new(name)
        .file_name()
        .and_then(|s| s.to_str())
        .filter(|s| !s.is_empty())
        .unwrap_or("formatted.json")
        .to_string()
}

fn ensure_json_extension(path: PathBuf) -> PathBuf {
    let already_json = path
        .extension()
        .and_then(|e| e.to_str())
        .is_some_and(|e| e.eq_ignore_ascii_case("json"));
    if already_json {
        return path;
    }
    path.with_extension("json")
}

/// Write through a sibling temp file and rename, so a failure part-way through
/// leaves any pre-existing file at `path` intact instead of truncated.
fn write_atomic(path: &Path, content: &str) -> std::io::Result<()> {
    let dir = path
        .parent()
        .filter(|d| !d.as_os_str().is_empty())
        .unwrap_or_else(|| Path::new("."));
    let stem = path
        .file_name()
        .map(|n| n.to_string_lossy().into_owned())
        .unwrap_or_else(|| "out".to_string());
    let tmp = dir.join(format!(".{stem}.{}.tmp", std::process::id()));

    fs::write(&tmp, content)?;
    match fs::rename(&tmp, path) {
        Ok(()) => Ok(()),
        Err(e) => {
            let _ = fs::remove_file(&tmp);
            Err(e)
        }
    }
}

#[tauri::command]
async fn save_json(
    app: tauri::AppHandle,
    default_name: String,
    content: String,
) -> Result<Option<String>, String> {
    if content.len() > MAX_SAVE_BYTES {
        return Err("content exceeds 8 MiB limit".into());
    }
    if serde_json::from_str::<serde_json::Value>(&content).is_err() {
        return Err("content is not valid JSON".into());
    }

    let (tx, rx) = std::sync::mpsc::channel();
    app.dialog()
        .file()
        .set_file_name(sanitize_default_name(&default_name))
        .add_filter("JSON", &["json"])
        .save_file(move |picked| {
            if tx.send(picked).is_err() {
                eprintln!("save_json: dialog result dropped, receiver already gone");
            }
        });

    // The dialog resolves on its own thread; block a worker rather than an async
    // task, otherwise the recv() below would stall the runtime.
    let picked = tauri::async_runtime::spawn_blocking(move || rx.recv())
        .await
        .map_err(|e| e.to_string())?
        .map_err(|e| e.to_string())?;

    let Some(picked) = picked else {
        return Ok(None);
    };

    let path = ensure_json_extension(picked.into_path().map_err(|e| e.to_string())?);
    write_atomic(&path, &content).map_err(|e| e.to_string())?;
    Ok(Some(path.to_string_lossy().into_owned()))
}

#[tauri::command]
fn copy_text(app: tauri::AppHandle, text: String) -> Result<(), String> {
    if text.len() > MAX_COPY_BYTES {
        return Err("text exceeds 8 MiB limit".into());
    }
    app.clipboard().write_text(text).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![save_json, copy_text])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn default_name_keeps_plain_names() {
        assert_eq!(sanitize_default_name("formatted_42.json"), "formatted_42.json");
    }

    #[test]
    fn default_name_strips_directory_components() {
        assert_eq!(sanitize_default_name("../../.ssh/authorized_keys"), "authorized_keys");
        assert_eq!(sanitize_default_name("/etc/passwd"), "passwd");
    }

    #[test]
    fn default_name_falls_back_on_degenerate_input() {
        for input in ["", "/", "..", "../.."] {
            assert_eq!(sanitize_default_name(input), "formatted.json", "input: {input:?}");
        }
    }

    #[test]
    fn extension_is_forced_to_json() {
        assert_eq!(ensure_json_extension(PathBuf::from("/tmp/a.txt")), PathBuf::from("/tmp/a.json"));
        assert_eq!(ensure_json_extension(PathBuf::from("/tmp/a")), PathBuf::from("/tmp/a.json"));
        assert_eq!(ensure_json_extension(PathBuf::from("/tmp/a.JSON")), PathBuf::from("/tmp/a.JSON"));
    }

    #[test]
    fn atomic_write_creates_then_replaces() {
        let dir = std::env::temp_dir().join(format!("hushjson-atomic-{}", std::process::id()));
        fs::create_dir_all(&dir).unwrap();
        let target = dir.join("out.json");

        write_atomic(&target, "{\"a\":1}").unwrap();
        assert_eq!(fs::read_to_string(&target).unwrap(), "{\"a\":1}");

        write_atomic(&target, "{\"b\":2}").unwrap();
        assert_eq!(fs::read_to_string(&target).unwrap(), "{\"b\":2}");

        // No temp leftovers behind.
        let strays: Vec<_> = fs::read_dir(&dir)
            .unwrap()
            .filter_map(|e| e.ok())
            .map(|e| e.file_name().to_string_lossy().into_owned())
            .filter(|n| n != "out.json")
            .collect();
        assert!(strays.is_empty(), "unexpected leftovers: {strays:?}");

        fs::remove_dir_all(&dir).unwrap();
    }
}
