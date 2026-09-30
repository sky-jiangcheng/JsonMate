#!/usr/bin/env node
/* ==============================================================
   版本一致性检查 / 自动修复引擎

   五处版本号必须保持一致:
     - version.json              (版本单一源, build.js/sync-versions.js 由它反向覆写)
     - package.json              (web / npm)
     - src-tauri/tauri.conf.json (Tauri 主配置, 桌面/App Store 继承)
     - src-tauri/Cargo.toml     (Rust 包版本)
     - sw.js                     (PWA service worker 缓存名)

   注意: version.json 必须在检查清单里。sync-versions.js 以它为源覆写其余
   文件, 若门禁只看其余几处, 手工改齐它们却漏改 version.json 时检查会通过,
   而构建又把版本静默改回 version.json 的旧值。

   子命令:
     check              检查五处是否一致 (不一致 -> exit 1)
     fix                以 package.json 为准, 把其余同步成一致
                         (复用 scripts/bump-version.js)
     tag [vX.Y.Z]      检查 tag 版本号(去掉 v) 是否等于所有文件的当前版本
                         (发版门禁: 任一不一致则 exit 1, 防止上传错误/重复版本)

   退出码: 0 = 一致/成功, 1 = 不一致/失败, 2 = 参数/环境错误
============================================================== */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

// sw.js 的 CACHE_NAME 前缀派生自 package.json 的 name，不再写死字面量：
// 否则仓库/包改名后这条正则会静默匹配不到，readVersion 返回 null，
// 检查会以"(缺失)"失败 —— 或者更糟，被放宽成不比前缀的哑弹。
const PKG_NAME = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8')
).name;
const PKG_NAME_RE = PKG_NAME.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const FILES = {
  'version.json': /"version":\s*"([^"]+)"/,
  'package.json': /"version":\s*"([^"]+)"/,
  'src-tauri/tauri.conf.json': /"version":\s*"([^"]+)"/,
  'src-tauri/Cargo.toml': /^\s*version\s*=\s*"([^"]+)"/m,
  'sw.js': new RegExp(`CACHE_NAME\\s*=\\s*'${PKG_NAME_RE}-v([\\d\\.]+)'`),
};

function readVersion(file, re) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) return null;
  const m = fs.readFileSync(p, 'utf-8').match(re);
  return m ? m[1] : null;
}

function getAll() {
  const out = {};
  for (const [f, re] of Object.entries(FILES)) out[f] = readVersion(f, re);
  return out;
}

const cmd = process.argv[2];
const arg = process.argv[3];

if (cmd === 'check') {
  const v = getAll();
  console.log('版本现状:');
  for (const [f, ver] of Object.entries(v)) {
    console.log(`  ${f}: ${ver ?? '(缺失)'}`);
  }
  const vals = Object.values(v).filter((x) => x != null);
  const uniq = [...new Set(vals)];
  if (Object.values(v).some((x) => x == null)) {
    console.error('\n❌ 有版本文件读不到(上面标为 (缺失)) — 清单与仓库布局不一致, 按不一致处理');
    process.exit(1);
  }
  if (uniq.length <= 1) {
    console.log(`\n✅ 五处版本一致: ${uniq[0] ?? 'N/A'}`);
    process.exit(0);
  } else {
    console.error('\n❌ 版本不一致! 请以 package.json 为准统一 (运行 check-versions.js fix):');
    console.error('   ' + Object.entries(v).map(([f, x]) => `${f}=${x}`).join('\n   '));
    process.exit(1);
  }
} else if (cmd === 'fix') {
  const pkg = readVersion('package.json', FILES['package.json']);
  if (!pkg) {
    console.error('❌ 无法读取 package.json version');
    process.exit(1);
  }
  console.log(`以 package.json=${pkg} 为准, 同步其余文件...`);
  execFileSync('node', [path.join(ROOT, 'scripts', 'bump-version.js'), pkg], { stdio: 'inherit' });
  console.log('✅ 已同步');
  process.exit(0);
} else if (cmd === 'tag') {
  let tagVer = (arg || process.env.GITHUB_REF_NAME || '').replace(/^v/, '');
  const v = getAll();
  console.log('tag 版本:   ' + (tagVer || '(未提供)'));
  for (const [f, ver] of Object.entries(v)) console.log(`  ${f}: ${ver ?? '(缺失)'}`);
  if (!tagVer) {
    console.error('\n❌ 未提供 tag 版本 (用法: check-versions.js tag v1.5.1)');
    process.exit(2);
  }
  // 与清单里**每一处**比对: 只比 package.json 会漏掉 version.json,
  // 而 sync-versions.js 正是以 version.json 为源覆写其余文件。
  const drift = Object.entries(v).filter(([, ver]) => ver !== tagVer);
  if (drift.length) {
    console.error(`\n❌ tag 版本(${tagVer}) 与以下文件不一致:`);
    for (const [f, ver] of drift) console.error(`   ${f}=${ver ?? '(缺失)'}`);
    console.error('   请先 bump 版本到 ' + tagVer + ' 再打 tag,');
    console.error('   否则构建会上传错误/重复的版本号到 App Store。');
    process.exit(1);
  }
  console.log('\n✅ tag 版本与五处文件一致');
  process.exit(0);
} else {
  console.error('Usage: node scripts/check-versions.js <check|fix|tag> [vX.Y.Z]');
  process.exit(2);
}
