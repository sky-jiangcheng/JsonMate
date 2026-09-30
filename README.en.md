# HushJSON: JSON Formatter

A modern JSON formatter, minifier, validator and diff tool. **Pure frontend — no backend, zero data uploads**, available as Web / desktop / iOS apps, with 5 built-in UI languages.

> 🌐 **English** · [简体中文](README.md)

> **Use it online** → [sky-jiangcheng.github.io/hush-json](https://sky-jiangcheng.github.io/hush-json/)

[![Pages](https://github.com/sky-jiangcheng/hush-json/actions/workflows/pages.yml/badge.svg)](https://github.com/sky-jiangcheng/hush-json/actions/workflows/pages.yml)
[![Release](https://img.shields.io/github/v/release/sky-jiangcheng/hush-json?label=release&color=blue)](https://github.com/sky-jiangcheng/hush-json/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Tauri](https://img.shields.io/badge/Tauri-v2-24C8DB?logo=tauri&logoColor=white)](https://tauri.app)

---

## Table of Contents

- [Core Features](#core-features)
- [UI Languages](#ui-languages)
- [Screenshots](#screenshots)
- [Quick Start](#quick-start)
- [Running Tests](#running-tests)
- [Desktop Apps & iOS](#desktop-apps--ios)
- [Offline (PWA)](#offline-pwa)
- [Privacy](#privacy)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Build & Deploy Pipeline](#build--deploy-pipeline)
- [Documentation Index](#documentation-index)
- [Contributing](#contributing)
- [License](#license)

---

## Core Features

### 🔧 JSON Processing

| Feature | Description |
|---------|-------------|
| **Format** | 2-space indent, syntax highlighting, interactive tree view |
| **Minify** | Single-line compact output |
| **Escape / Unescape** | JSON string escaping |
| **Auto-repair** | Auto-completes missing brackets, fixes unquoted keys |
| **Live validation** | Red / green indicator of JSON validity (400ms debounce) |

### 🌲 Interactive JSON Tree

- Object / array nodes expand and collapse (`▼` / `▶` toggle)
- Collapsed nodes show a summary (`{3 keys}` / `[5 items]`)
- Line-number column scrolls in sync with the main pane

### 📋 List / Detail View

- Array-type JSON automatically switches to a split-pane layout
- Left-side list items carry preview summaries; click to swap the right detail pane
- List panel is collapsible

### 🔄 JSON Diff

- **Structured recursive comparison**, not text-line diff — matches by key / index
- Diff highlighting: 🟢 added · 🔴 removed · 🟡 changed
- Left and right trees render independently, each keeping its own expand / collapse state
- Scroll sync, with left/right swap support

### 📜 History

- Formatted results can be saved to local history (`localStorage`)
- Click a history entry to load and format it instantly
- Select up to 2 entries at a time for comparison
- Sidebar is collapsible

### 🎨 Themes

- 🌙 Dark mode (GitHub Dark)
- ☀️ Light mode (GitHub Light)
- Preference stored in `localStorage`, persists across reloads

### ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl` / `Cmd` + `Enter` | Format |
| `Ctrl` / `Cmd` + `S` | Save to history |
| `Ctrl` / `Cmd` + `D` | Download JSON file |
| `Escape` | Close dialog / diff view |

### 📎 Drag & Drop

Drag a `.json` file onto the input area to load and format it automatically.

---

## UI Languages

**5 UI languages** are built in. On first visit the language resolves as `localStorage preference → system language → English`, and can be switched any time from the language menu in the top-right corner. The choice persists.

| Language | Code |
|----------|------|
| 中文 | `zh` |
| English | `en` |
| Español | `es` |
| Deutsch | `de` |
| 日本語 | `ja` |

> The window title is fixed to `HushJSON: JSON Formatter`, and the header logo / icon label stay fixed as `HushJSON` (none of these switch with the UI language). Brand and category are deliberately separated: the brand is for being remembered, the category word is for being found via search. Tests assert on `document.title`.

---

## Screenshots

### 📱 Phone

| Empty state | Format success | Invalid input |
|:---:|:---:|:---:|
| ![Empty state](screenshots/phone/json-empty-state.jpg) | ![Format success](screenshots/phone/format-success.jpg) | ![Invalid input](screenshots/phone/invalid-json-input.jpg) |

| Error hint | More actions |
|:---:|:---:|
| ![Error hint](screenshots/phone/invalid-json.jpg) | ![More actions](screenshots/phone/more-action-menu.jpg) |

### 📟 iPad (Portrait)

| Empty state | Format result | Diff view | History |
|:---:|:---:|:---:|:---:|
| ![Empty state](screenshots/ipad-portrait/screen-01.png) | ![Format](screenshots/ipad-portrait/screen-02.png) | ![Diff](screenshots/ipad-portrait/screen-03.png) | ![History](screenshots/ipad-portrait/screen-04.png) |

| More actions |
|:---:|
| ![More actions](screenshots/ipad-portrait/screen-05.png) |

> Screenshot source files live in [`screenshots/`](screenshots/), split into `phone/` and `ipad-portrait/` subdirectories.

---

## Quick Start

### Prerequisites

| Platform | Requirements |
|----------|--------------|
| macOS | Xcode Command Line Tools |
| Linux | `sudo apt install libwebkit2gtk-4.1-dev libgtk-3-dev libglib2.0-dev librsvg2-dev` |
| Windows | Visual Studio C++ Build Tools + WebView2 |

Node.js 20+.

### Web only (fastest)

No Rust or Tauri needed. After cloning:

```bash
npm install
npm run build:dist      # generates dist/
npm run preview         # starts a static server
```

Then open **<http://localhost:8000/src/>**.

> `npm run preview` runs `python3 -m http.server 8000`, serving the **repository root**, so the app lives at `/src/` rather than the root path. To preview the `dist/` build output, visit <http://localhost:8000/dist/>.

---

## Running Tests

The project uses Playwright-driven tests on system Chrome (`channel: 'chrome'`) — **no** `npx playwright install` needed. There are 3 specs: layout smoke tests (responsive breakpoints, i18n switching, theme persistence), output-state, and Tauri environment detection.

```bash
npm install
node scripts/build.js             # specs read dist/, build first
node tests/layout.spec.mjs
node tests/output-state.spec.mjs
node tests/tauri-detection.spec.mjs
```

> There is **no** `npm test` script in this repo. CI (the `Layout Smoke Tests` workflow) runs the same commands in the same order.

Always run it after changing layout or styles under `src/`. See [ARCHITECTURE.md](ARCHITECTURE.md#10-测试策略) for details.

---

## Desktop Apps & iOS

Packaged as native apps via Tauri v2. Pushing a `v*` tag triggers CI to build, sign and ship automatically:

| Platform | Bundler | Artifacts |
|----------|---------|-----------|
| macOS | Tauri v2 | `.dmg` / `.app` / App Store `.pkg` |
| Windows | Tauri v2 | NSIS installer `.exe` (**no `.msi`**) |
| Linux | Tauri v2 | `.deb` / `.rpm` / `.AppImage` |
| iOS | Tauri v2 (iOS) | App Store / TestFlight |

### Local builds

```bash
npm run build          # full desktop build
npm run build:macos    # macOS universal-apple-darwin
npm run build:appstore # macOS App Store .pkg
```

Artifacts land in `src-tauri/target/release/bundle/`.

### Naming layers

The product deliberately uses different names in different places:

| Location | Value |
|----------|-------|
| Brand name (`productName`, PWA `short_name`, header logo, iOS/macOS icon label, watermark default) | `HushJSON` |
| Full display name (window title, HTML `<title>`, PWA `name`) | `HushJSON: JSON Formatter` |
| Privacy page title | `隐私政策 · Privacy Policy — HushJSON` |
| Repository & package identity (GitHub slug, npm / Cargo `name`, Pages path, `CACHE_NAME` prefix) | `hush-json` |
| App Store listing name | `HushJSON: JSON Formatter` (set in App Store Connect metadata, **not carried by the repo**) |

> **The Bundle ID never changes with the brand** — `com.jsonbeautify.*` is locked in by Apple, and changing it would break the upgrade-detection chain.
> The "display name / package identity / Bundle ID" layers are therefore **intentionally inconsistent**: the brand exists only in the display layer, so rebranding never touches URLs,
> package names, or the upgrade chain of installed users.

---

## Offline (PWA)

The site is a full progressive web app:

- `manifest.json` declares icons, name, `display: standalone` and the `/hush-json/` scope
- `sw.js` implements a **stale-while-revalidate** strategy: serve from cache first, silently refresh in the background
- The cache key is `hush-json-v<version>`, auto-invalidated with each version bump

In supporting browsers you can "Install to home screen" and open it as a standalone window that **keeps working fully offline** — all JSON processing happens locally.

---

## Privacy

**No data ever leaves your device.**

- No sending, no uploading, no telemetry. The app is a pure static page with no backend
- History and theme preferences live only in your browser's `localStorage`
- The only third-party request is GitHub Pages static asset hosting

Full policy at [src/privacy.html](src/privacy.html) (also reachable from the in-app "About" page).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vanilla HTML / CSS / JavaScript, **no framework** |
| State management | In-house pub/sub store ([`src/app/store.js`](src/app/store.js)) |
| Syntax highlighting | highlight.js |
| Local storage | `localStorage` |
| Desktop / mobile | Tauri v2 (Rust + WRY) |
| CI/CD | GitHub Actions |

**The source is modular; the build output is a single file.** Development is split into 4 modules by responsibility, and `scripts/build.js` merges them into a single `dist/app.js` at build time to reduce runtime requests.

---

## Project Structure

```
.
├── src/                       ← Web app source (single source of truth)
│   ├── index.html             #   Page skeleton + inline critical CSS
│   ├── app.js                 #   Entry: event bindings & i18n table
│   ├── styles.css             #   Main styles
│   ├── styles.mobile.css      #   Mobile styles
│   ├── head.js                #   head injection
│   ├── privacy.html           #   Privacy policy page
│   └── app/                   #   Business modules (merged into dist/app.js at build)
│       ├── store.js           #     Central state + pub/sub
│       ├── actions.js         #     Pure business logic, no DOM access
│       ├── render.js          #     State → DOM rendering
│       └── router.js          #   Device type & UI layer detection
├── scripts/                   ← Build, version, icon, store scripts (15)
├── tests/layout.spec.mjs      ← Layout smoke tests
├── src-tauri/                 ← Tauri desktop / iOS project (Rust)
│   ├── src/                   #   Rust sources (lib.rs / main.rs)
│   ├── capabilities/          #   Permission declarations (core:default only)
│   ├── tauri.*.conf.json      #   3 platform configs
│   ├── gen/apple/             #   Xcode project (generated by tauri ios init, not committed)
│   └── target/                #   Rust build output (ignored)
├── screenshots/               ← Screenshot source files
│   ├── phone/
│   └── ipad-portrait/
├── dist/                      ← Web build output (ignored)
├── docs/                      ← GitHub Pages output (CI-generated, do not edit)
├── .github/workflows/         ← 4 workflows
├── .monkeycode/docs/          ← Internal docs (dev logs, milestones, optimization guides)
├── CHANGELOG.md               ← Version change log (Chinese)
├── ARCHITECTURE.md            ← Architecture doc (Chinese)
├── CONTRIBUTING.md            ← Conventions & contribution guide (Chinese)
└── LICENSE                    ← MIT
```

---

## Build & Deploy Pipeline

| Target | Trigger | Source → Output |
|--------|---------|-----------------|
| Web dist | `npm run build:dist` | `src/` + root static assets → `dist/` |
| GitHub Pages | push to `main` | `src/` → `docs/` (CI auto-commits) |
| Desktop / iOS release | push `v*` tag | whole repo → installers / IPA / PKG, App Store upload |

> ⚠️ **`docs/` is a CI-generated artifact, do not edit it by hand** — every `pages.yml` deployment runs `rm -rf docs` and rebuilds it; manual edits will be overwritten.

---

## Documentation Index

| Document | Contents |
|----------|----------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Module responsibilities, data flow, state management, test strategy (Chinese) |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Directory ownership, build pipeline, versioning rules, CI pitfalls (Chinese) |
| [CHANGELOG.md](CHANGELOG.md) | Version change log (Chinese) |
| [SECURITY.md](SECURITY.md) | Vulnerability reporting & supported versions (Chinese) |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Community code of conduct (Chinese) |
| [src/privacy.html](src/privacy.html) | Privacy policy (reachable in-app) |
| [.monkeycode/docs/](.monkeycode/docs/) | Internal docs: dev logs, milestones, optimization guides |

---

## Contributing

Issues and pull requests are welcome. Before starting, please read **[CONTRIBUTING.md](CONTRIBUTING.md)** (Chinese), which defines directory ownership, version consistency requirements and commit conventions.

---

## License

[MIT](LICENSE) © sky-jiangcheng
