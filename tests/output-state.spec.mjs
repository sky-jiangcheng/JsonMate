#!/usr/bin/env node
/* ==============================================================
   输出区状态与 diff 逻辑回归

   覆盖两个曾经真实存在的缺陷：

   A. 解析错误页残留（浏览器端到端，Playwright + 系统 Chrome）
      格式化 A 成功 → 改坏格式化失败(显示错误) → 改回 A 再格式化。
      错误页此前绕过 store 直接写 innerHTML，订阅者的 _lastRenderContent
      守卫会把"改回 A"判成无变化，页面永远停在错误视图。

   B. 原型键 diff（源码级单元校验，无需浏览器）
      {"toString":"x"} 这类合法 JSON 参与比较时，`key in obj` 会命中
      Object.prototype 上的同名成员，产生假的 changed，并把一个函数交给
      渲染器（renderJsonNode 对函数返回空串），对应行渲染成空白。

   运行: node scripts/build.js && node tests/output-state.spec.mjs
   依赖: playwright-core + 系统 Chrome（与 layout.spec.mjs 一致）；
        跳过 A 段（无浏览器环境）时设 SKIP_BROWSER=1，B 段仍会执行。
============================================================== */

import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(join(fileURLToPath(import.meta.url), '..', '..'));
const DIST = join(ROOT, 'dist');
const PORT = 8941;
const BASE = `http://127.0.0.1:${PORT}`;

let passed = 0, failed = 0;
function check(name, cond, detail) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}${detail ? ' — ' + detail : ''}`); }
}

/* ---------------- B. diffJson 源码级校验 ---------------- */

// 按大括号配对抽出真实函数源码，避免在测试里重写一份逻辑（那样测不到线上代码）
function extractFn(text, header) {
  const start = text.indexOf(header);
  if (start < 0) return null;
  let i = text.indexOf('{', start), depth = 0;
  for (; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') { depth--; if (depth === 0) return text.slice(start, i + 1); }
  }
  return null;
}

function testDiffJson() {
  console.log('\n● diffJson 对原型键的处理（源码级）');
  const src = readFileSync(join(ROOT, 'src/app/render.js'), 'utf8');
  const diffSrc = extractFn(src, 'function diffJson(a, b)');
  if (!diffSrc) { check('能定位 diffJson', false, '源码结构变了，请同步本测试'); return; }
  check('能定位 diffJson', true);
  check('判键走自有属性而非 in', /function hasOwnKey/.test(diffSrc) || /hasOwnKey\(/.test(diffSrc),
    'diffJson 仍在用 `key in obj`，原型键会产生幻影行');

  const helper = extractFn(src, 'function hasOwnKey(obj, key)');
  const diffJson = new Function(
    (helper || 'function hasOwnKey(o, k) { return k in o; }') + '\n' + diffSrc + '\nreturn diffJson;'
  )();

  const kinds = (a, b) => (diffJson(a, b).c || []).map((c) => `${c.k}:${c.d.t}`).sort().join(',');
  check('{"toString":"x"} vs {"a":1} → toString 判为删除、a 判为新增',
    kinds({ toString: 'x' }, { a: 1 }) === 'a:add,toString:rem',
    kinds({ toString: 'x' }, { a: 1 }));
  check('{"constructor":1} vs {"other":2} → constructor 判为删除',
    kinds({ constructor: 1 }, { other: 2 }) === 'constructor:rem,other:add',
    kinds({ constructor: 1 }, { other: 2 }));
  check('两边都有的自有键仍按 changed 处理',
    kinds({ toString: 'x' }, { toString: 'y' }) === 'toString:chg',
    kinds({ toString: 'x' }, { toString: 'y' }));
  check('普通对象 diff 不受影响',
    kinds({ a: 1, b: 2 }, { a: 1, b: 3 }) === 'a:same,b:chg',
    kinds({ a: 1, b: 2 }, { a: 1, b: 3 }));
}

/* ---------------- A. 错误态端到端 ---------------- */

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
};

async function testErrorFlow() {
  console.log('\n● 成功 → 失败 → 改回同样内容再成功（浏览器）');
  if (process.env.SKIP_BROWSER) { console.log('  – SKIP_BROWSER=1，跳过'); return; }
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('  ✗ dist/index.html 不存在 — 先跑 node scripts/build.js');
    failed++; return;
  }
  const { chromium } = await import('playwright-core');
  const server = createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, BASE).pathname);
    const file = join(DIST, urlPath === '/' ? 'index.html' : urlPath);
    if (!existsSync(file)) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(readFileSync(file));
  });
  await new Promise((r) => server.listen(PORT, '127.0.0.1', r));
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(BASE + '/');
    await page.waitForTimeout(300);
    const input = page.locator('#input');
    const format = () => page.locator('[data-action="format"]').first().click();
    const viewKind = () => page.evaluate(() => {
      const a = document.getElementById('output-content-area');
      if (!a) return 'no-area';
      if (a.querySelector('.error-display')) return 'error';
      if (a.querySelector('.json-tree')) return 'tree';
      if (a.querySelector('.output-placeholder')) return 'placeholder';
      return 'other';
    });

    await input.fill('{"a":1}'); await format(); await page.waitForTimeout(250);
    check('首次格式化渲染 JSON 树', (await viewKind()) === 'tree', await viewKind());
    await input.fill('{"a":'); await format(); await page.waitForTimeout(250);
    check('非法输入显示错误页', (await viewKind()) === 'error', await viewKind());
    await input.fill('{"a":1}'); await format(); await page.waitForTimeout(250);
    check('改回同一内容后错误页被 JSON 树替换', (await viewKind()) === 'tree', await viewKind());
  } finally {
    await browser.close();
    server.close();
  }
}

testDiffJson();
await testErrorFlow();
console.log(`\n结果: ${passed} 通过, ${failed} 失败`);
process.exit(failed ? 1 : 0);
