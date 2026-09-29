#!/usr/bin/env node
/* ==============================================================
   Tauri 环境探测回归测试

   验证 src/app/router.js + head.js 的平台判定在三种宿主下不误判：
     1. 只有 __TAURI_INTERNALS__（Tauri v2 关闭 withGlobalTauri 后的真实形态），
        且 WebView 报告的 innerWidth 被扭曲 —— 必须仍判为 desktop，
        状态栏不能被移动端逻辑隐藏。
     2. 存在全局 __TAURI__ 但无 .core（旧 withGlobalTauri 形态）—— 同样判 desktop。
     3. 普通桌面浏览器（两个全局都不存在）—— 判 desktop。

   运行: node scripts/build.js && node tests/tauri-detection.spec.mjs
   依赖: playwright-core + 系统 Chrome（channel: 'chrome'），
         与 tests/layout.spec.mjs 一致，本地与 CI 行为相同。
   静态服务自带（对齐 layout.spec.mjs 的做法），不依赖外部端口。
============================================================== */

import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(join(fileURLToPath(import.meta.url), '..', '..'));
const DIST = join(ROOT, 'dist');
const PORT = Number(process.env.TEST_PORT || 8932);
const BASE = `http://127.0.0.1:${PORT}`;
// 只有显式给了 TEST_URL 才打远端(例如已部署的 Pages 版); 否则一律自托管 dist/。
// 注意别用 `TARGET === BASE` 判: 默认值是 BASE + '/'，尾斜杠会让比较恒为 false。
const USE_LOCAL = !process.env.TEST_URL;
const TARGET = USE_LOCAL ? `${BASE}/` : process.env.TEST_URL;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
};

if (!TARGET.startsWith('http')) {
  console.error(`TEST_URL 不是 http(s) 地址: ${TARGET}`);
  process.exit(2);
}
// 只有跑本地产物时才要求 dist/ 已构建
if (USE_LOCAL && !existsSync(join(DIST, 'index.html'))) {
  console.error('dist/index.html 不存在 — 先跑 node scripts/build.js');
  process.exit(2);
}

const server = createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, BASE).pathname);
  const file = join(DIST, urlPath === '/' ? 'index.html' : urlPath);
  if (!existsSync(file)) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});

let passed = 0, failed = 0;

async function runScenario(browser, name, initFn, viewport) {
  const context = await browser.newContext({ viewport });
  if (initFn) await context.addInitScript(initFn);
  const page = await context.newPage();
  await page.goto(TARGET);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(300);

  const device = await page.evaluate(
    () => document.documentElement.getAttribute('data-device')
  );
  const bar = await page.evaluate(() => {
    const el = document.querySelector('.statusbar');
    if (!el) return { missing: true };
    const cs = getComputedStyle(el);
    return { missing: false, display: cs.display, visibility: cs.visibility, height: el.getBoundingClientRect().height };
  });
  await context.close();

  const ok = device === 'desktop' && !bar.missing && bar.display === 'flex'
    && bar.visibility !== 'hidden' && bar.height > 0;
  const detail = bar.missing ? 'statusbar 不存在'
    : `device=${device} display=${bar.display} visibility=${bar.visibility} height=${bar.height}`;
  if (ok) passed++; else failed++;
  console.log(`  ${ok ? '✓' : '✗'} ${name} — ${detail}`);
}

async function main() {
  if (USE_LOCAL) await new Promise((r) => server.listen(PORT, '127.0.0.1', r));

  const browser = await chromium.launch({ channel: 'chrome' });
  const viewport = { width: 1200, height: 800 };
  try {
    console.log(`\n● Tauri 环境探测 (${TARGET})`);
    await runScenario(browser, '只有 __TAURI_INTERNALS__ 且 innerWidth 被扭曲', () => {
      window.__TAURI_INTERNALS__ = { invoke: function () {}, transformCallback: function () {} };
      Object.defineProperty(window, 'innerWidth', { value: 600, configurable: true });
    }, viewport);

    await runScenario(browser, '旧形态: 全局 __TAURI__ 存在但无 .core', () => {
      window.__TAURI__ = { event: {} };
      Object.defineProperty(window, 'innerWidth', { value: 600, configurable: true });
    }, viewport);

    await runScenario(browser, '普通桌面浏览器', null, viewport);
  } finally {
    await browser.close();
    if (USE_LOCAL) server.close();
  }

  console.log(`\n结果: ${passed} 通过, ${failed} 失败`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error('测试异常:', e.message);
  process.exit(1);
});
