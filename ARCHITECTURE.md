# 架构说明（ARCHITECTURE）

HushJSON 的技术架构、数据流与设计约束。**想改代码前先读这份文档** —— 里面记录了不少「为什么不那样写」的原因，避免重复踩坑。

---

## 目录

- [1. 总体架构](#1-总体架构)
- [2. 前端模块体系](#2-前端模块体系)
- [3. 状态管理](#3-状态管理)
- [4. 设备与 UI 层判定](#4-设备与-ui-层判定)
- [5. Rust / Tauri 层](#5-rust--tauri-层)
- [6. 安全模型](#6-安全模型)
- [7. PWA 与离线](#7-pwa-与离线)
- [8. 构建链路](#8-构建链路)
- [9. CI/CD](#9-cicd)
- [10. 测试策略](#10-测试策略)
- [11. i18n](#11-i18n)

---

## 1. 总体架构

一个**纯前端、无后端、零数据上传**的应用。核心逻辑全部在浏览器里跑，因此：

- 网页版、PWA、桌面端、iOS 跑的是**同一份** JavaScript
- 没有服务端 API，没有数据库，没有账号体系
- 所有用户数据（历史记录、主题、语言）只存在浏览器 `localStorage`

```
┌──────────────────────────────────────────────────┐
│  src/  (唯一真源)                                 │
│                                                  │
│  head.js ── 同步设 data-device，防布局闪屏          │
│     ↓                                            │
│  app/router.js ── 设备判定                        │
│  app/store.js   ── 中心状态 + pub/sub             │
│  app/actions.js ── 纯业务逻辑（不碰 DOM）          │
│  app/render.js  ── 状态 → DOM                    │
│  app.js         ── 入口：i18n 表 + 事件绑定        │
│     ↓                                            │
│  scripts/build.js 合并 → dist/app.js（单文件）     │
└──────────────────────────────────────────────────┘
                    ↓
        ┌───────────┴───────────┐
     dist/                 src-tauri/
     (网页/PWA)            (Rust 壳 + WRY WebView)
        ↓                       ↓
   GitHub Pages          macOS / Windows / Linux / iOS
```

**关键设计：源码多模块，构建产物单文件。**

开发时按职责拆成 5 个文件（都是 IIFE），构建时由 `scripts/build.js` 按固定顺序拼成单个 `dist/app.js`，减少运行时请求数、也避免 Tauri 壳内的资源加载竞态。

---

## 2. 前端模块体系

| 文件 | 行数 | 职责 |
|------|-----:|------|
| `src/app/router.js` | 83 | 设备类型与 UI 层判定，**单一真源** |
| `src/app/store.js` | 79 | 中心状态 + pub/sub 订阅 |
| `src/app/actions.js` | 394 | 纯业务逻辑：格式化、压缩、校验、对比、修复。**不碰 DOM** |
| `src/app/render.js` | 2018 | 把状态渲染成 DOM，订阅 `__store` |
| `src/app.js` | ~1200 | 入口：`I18N` 语言表、事件绑定、DOM 引用 |
| `src/head.js` | 19 | 在 `<head>` 同步设 `data-device` |
| `src/styles.css` | — | 主样式 |
| `src/styles.mobile.css` | — | 移动端样式 |

### 依赖方向

严格单向，**不可逆向引用**：

```
router.js  →  无依赖
store.js   →  无依赖
actions.js →  store.js（读写状态）
render.js  →  store.js（订阅变化）
app.js     →  以上全部（组装）
```

> **为什么要拆？** 曾经的实现是一个手工维护的单体 `app.js`，`build.js` 只拷贝它 —— 结果发布出去的产物**根本不读 `src/` 的其他改动**，改了模块等于没改。拆分 + 构建期合并从结构上消除了这个风险（`build.js` 里 `BUNDLE_ORDER` 缺失任一文件会直接抛错）。

### 模块加载的两种形态

| 场景 | `index.html` 加载的脚本 |
|------|------------------------|
| **开发态**（`src/index.html`） | `head.js` → `highlight.min.js` → `app/router.js` → `app/store.js` → `app/actions.js` → `app/render.js` → `app.js`（7 个） |
| **构建态**（`dist/index.html`） | `head.js` → `highlight.min.js` → `app.js`（3 个，合并产物） |

顺序即依赖顺序，**不要改 `BUNDLE_ORDER`**。

---

## 3. 状态管理

自研的极简 pub/sub，无框架、无 Proxy 魔法。

全局单例挂在 `window.__store`：

```js
window.__store = {
  getState(),          // 读取整个状态
  setState(partial),   // 浅合并部分状态，触发订阅者
  getStateForKey(key), // 读单个字段
  subscribe(fn),       // 订阅变更，返回 unsubscribe 函数
  persistLang(lang),   // 语言偏好落盘 localStorage
  persistTheme(theme), // 主题偏好落盘 localStorage
};
```

### 约定

- **状态只存在 `_state` 一处**，不散落在 DOM 属性或模块级变量里
- `render.js` 通过 `subscribe()` 订阅，**不主动读 DOM 状态**
- 偏好类字段（`lang` / `theme`）由 `persist*` 落盘；**其余状态不持久化**
- `actions.js` 改状态后不直接操作 DOM，渲染交给 `render.js`

> ⚠️ `store.lang` 的默认值是 `'en'`，**它不代表用户偏好**。i18n 初始语言解析必须走 `localStorage → 系统语言 → 英文` 三级回退，若把 `store.lang` 当偏好读，会永远覆盖系统语言。

---

## 4. 设备与 UI 层判定

`src/app/router.js` 是判定的**唯一真源**，导出三个概念：

| 函数 | 返回值 | 用途 |
|------|--------|------|
| `deviceClass()` | `'mobile'` / `'desktop'` | 真实设备类型 |
| `isTauriShell()` | `boolean` | 是否在 Tauri 壳内 |
| `uiLayer()` | `'mobile'` / `'desktop'` | **布局用**的最终分层 |

### 判定逻辑

```
uiLayer():
  deviceClass() === 'mobile'  → 'mobile'
  isTauriShell()              → 'desktop'    // 壳内强制桌面布局
  否则                        → innerWidth <= 900 ? 'mobile' : 'desktop'

deviceClass():
  移动 UA (Mobi|Android|iPhone|iPad|iPod)     → 'mobile'
  非 (hover: hover) and (pointer: fine)        → 'mobile'
  matchMedia 不可用（老环境）                   → 'desktop'
  其余                                        → 'desktop'

isTauriShell():
  window.__TAURI_INTERNALS__ || window.__TAURI__  → true
```

### 两条反直觉的规则

**① Tauri 壳内强制桌面层。**
壳内 WebView 初始化阶段的 `innerWidth` 不可靠（可能读到 0 或错误值），若据此判成 mobile，桌面窗口会闪一下移动端布局。所以壳内一律 `desktop`，不看宽度。

**② Tauri v2 无论 `withGlobalTauri` 是否开启都会注入 `__TAURI_INTERNALS__`。**
它是 IPC 桥，不能用来判断「是否启用全局 API」。判断壳环境用它的**存在性**即可。

### 布局闪屏的两段式处理

`head.js` 在 `<head>` 里**同步**执行，先粗判为 `desktop` 写进 `<html data-device>`，CSS 移动端规则据此不生效 → 桌面端不会闪移动布局。随后 `router.js` 在 `DOMContentLoaded` 后跑精确判定并纠正。

> 顺序反了就会闪。`head.js` 必须是 `index.html` 的**第一个** script。

---

## 5. Rust / Tauri 层

`src-tauri/src/` 总共只有 **172 行**（`lib.rs` 167 + `main.rs` 5）。Rust 侧刻意保持极薄 —— 业务逻辑全在前端，Rust 只做三件浏览器做不到的事：

1. 保存文件到磁盘（原生保存对话框）
2. 读剪贴板 / 写剪贴板
3. 应用生命周期与窗口管理

使用的插件仅两个：`tauri-plugin-dialog`（文件对话框）、`tauri-plugin-clipboard-manager`（剪贴板）。

### 平台配置

3 套配置，共享同一份 `src/` 前端：

| 配置 | 用途 | identifier |
|------|------|-----------|
| `tauri.conf.json` | 默认 / 桌面（GitHub 直发 dmg/app、Windows、Linux） | `com.jsonmate.desktop` |
| `tauri.appstore.conf.json` | macOS App Store（签名 + entitlements） | `com.jsonbeautify.desktop.appstore` |
| `tauri.ios.conf.json` | iOS App Store | `com.jsonbeautify.desktop.appstore.ios` |

> 曾有 `tauri.desktop.conf.json` / `tauri.mobile.conf.json` 两套，全仓无任何构建或 CI 引用（只有 `sync-versions.js` 在维护它们的版本号），且 `$schema` 指向失效 URL、`bundle.icon` 缺 icns 且 16x16 重复 —— 一旦被误当 `--config` 用会产出错的包，已删除。

> **iOS 侧没有声明式名称字段。** Tauri schema 的 `bundle.iOS` 不含任何名称配置，tauri-bundler 把 `productName` 直写进 `CFBundleDisplayName` / `CFBundleName`。要改 iOS 显示名只能在 CI 里用 PlistBuddy 改写 plist（见 `release.yml` 的 `Initialize iOS project` 步骤）。macOS 侧则有 `bundle.macOS.bundleName` 可声明式设置。

### Xcode 工程

`src-tauri/gen/apple/` 是 `tauri ios init` 的产物，**不入库**。CI 每次重新生成。

**步骤顺序不能颠倒**：`ios init` → `tauri icon` → removeAlpha 覆盖。`ios init` 会用模板默认图标重建工程，先生成图标会被冲掉 —— 这就是 iOS 图标一直是默认图标的根因，详见 [CONTRIBUTING.md §8.8](CONTRIBUTING.md)。

---

## 6. 安全模型

### CSP

```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
img-src 'self' data:; font-src 'self'; connect-src 'self';
object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'
```

- `script-src 'self'` —— **没有 `unsafe-inline`**，因此不存在任何内联 `<script>`，`head.js` 正是为此从内联脚本外置而来
- `style-src` 保留 `'unsafe-inline'`（动态计算样式需要）
- `connect-src 'self'` —— 不允许对外发请求，这是「零上传」的强制保障

### Tauri 权限

`src-tauri/capabilities/default.json` 只声明：

```json
{ "identifier": "default", "windows": ["main"], "permissions": ["core:default"] }
```

配合 `withGlobalTauri: false`，WebView 侧拿不到全局 Tauri API，必须走受控的 IPC command。

### 跨 WebView 边界的输入约束

Rust 侧所有来自 WebView 的输入都做了边界收敛：

| 常量 | 值 | 作用 |
|------|-----|------|
| `MAX_SAVE_BYTES` | 8 MiB | 保存文件大小上限 |
| `MAX_COPY_BYTES` | 8 MiB | 剪贴板写入上限（与保存同界，因为同样穿越 WebView 信任边界） |
| `default_name` | `Path::file_name` | 剥掉目录分量，只留裸文件名，防止路径穿越 |

> **改 Rust 代码时注意**：任何新增的 command 都要复用这些上限，不要直接信任前端传入的长度或路径。

### 供应链

- `npm run check:cdn`（`pre-commit-check.js`）在提交前扫描，**禁止引入任何外部 CDN 引用** —— 第三方资源既影响隐私承诺（会向对方发请求），也破坏离线能力
- 依赖漏洞在 v1.5.78 一并修复

---

## 7. PWA 与离线

`sw.js` 实现 **stale-while-revalidate**：

```
install  → 预缓存 urlsToCache 列表
activate → 删除所有非当前 CACHE_NAME 的旧缓存
fetch    → 有缓存先返回缓存，同时后台 fetch 并写回缓存
```

缓存键格式 `hush-json-v<version>`，**随版本号自动失效** —— 这也是 `sw.js` 必须在 bump 时同步版本的原因（见 [CONTRIBUTING.md §4](CONTRIBUTING.md)）。

`manifest.json` 声明 `display: standalone`、`start_url` 与 `scope` 均为 `/hush-json/`（**大小写敏感**，跟随仓库名）。

---

## 8. 构建链路

### 网页构建

```bash
npm run build:dist     # → scripts/build.js
```

`build.js` 做三件事：

1. `rm -rf dist/` 后重建
2. 拷贝静态资源（`styles.css`、`styles.mobile.css`、`head.js`、`privacy.html`）+ 根目录资源（highlight.js/css、图标、`manifest.json`、`sw.js`）
3. **合并 5 个 JS 模块 → `dist/app.js`**，顺序固定：

```
app/router.js + app/store.js + app/actions.js + app/render.js + app.js
```

各模块都是 IIFE，用 `\n;\n` 连接以规避 ASI 边界问题。任一源文件缺失会**直接抛错**，不会静默产出残缺包。

### Tauri 构建

```bash
npm run build          # 桌面
npm run build:macos    # macOS universal
npm run build:appstore # macOS App Store .pkg
```

先跑 `check:cdn` → `build:dist` → `tauri build`。产物在 `src-tauri/target/release/bundle/`。

### 三份产物的关系

| 目录 | 性质 | 能否手改 |
|------|------|---------|
| `src/` | 源 | ✅ 改这里 |
| `dist/` | 构建产物（已忽略） | ❌ 会被覆盖 |
| `docs/` | Pages 产物（CI 生成并提交） | ❌ `pages.yml` 会 `rm -rf` 后重建 |

---

## 9. CI/CD

4 个工作流：

| 工作流 | 触发 | 职责 |
|--------|------|------|
| **Version Check** | push / tag | `check-versions.js` 校验 4 个关键版本文件 |
| **Layout Smoke Tests** | push / PR | 跑 `node tests/layout.spec.mjs` |
| **Deploy to GitHub Pages** | push `main` | `rm -rf docs` → 重建 → 自动提交 |
| **Release Build** | push `v*` tag | 全平台构建 + 签名 + 上传 App Store |

`Release Build` 是最复杂的作业，App Store 上架踩过的坑（JWT 签名格式、409 版本冲突、`reviewSubmissions` 迁移、`appEncryptionDeclarations` 上限等）**完整记录在 [CONTRIBUTING.md §8](CONTRIBUTING.md)**,接手这块前请先读。

---

## 10. 测试策略

`tests/layout.spec.mjs` —— Playwright 驱动的**布局冒烟测试**。

```bash
npx playwright install chromium   # 首次
node tests/layout.spec.mjs
```

### 覆盖范围

- 响应式断点（`data-device` 判定：移动 UA、窄视口、桌面宽视口）
- Tauri 壳环境模拟（`__TAURI_INTERNALS__` 存在时强制桌面层）
- i18n：系统语言 → 默认语言、未支持语言回退英文、菜单切换与持久化
- 主题切换与刷新保持

### 断言方式

用 `data-*` 属性 + 计算样式 + 文本内容断言，**不是像素快照**。

这意味着改 UI 时测试失败，先判断是**回归**还是**断言本身该更新** —— 后者是正常的，不要为了让测试变绿而放松断言。

**没有单元测试。** `actions.js` 里的 JSON 解析 / 修复 / 对比逻辑目前靠人工与冒烟测试覆盖，这是已知的测试债。

### 何时必须跑

改 `index.html` 布局、改 `styles*.css`、改 `router.js`、改 i18n 表、改 `manifest.json` —— 都会影响断言。

---

## 11. i18n

- 语言表在 `src/app.js` 的 `I18N` 对象，支持 5 种：`zh` / `en` / `es` / `de` / `ja`
- 语言元数据在 `LANGUAGES` 数组（含 `code` 与 `label`），**切换菜单由此生成**，加语言只需改这一处
- 初始语言解析：`localStorage 偏好 → 系统语言 → 英文回退`
- 持久化走 `store.persistLang()`

### 命名分层（i18n 不覆盖的部分）

| 位置 | 取值 | 理由 |
|------|------|------|
| 品牌名：`productName`、页头 Logo、PWA `short_name`、iOS/macOS 图标标签、水印默认值 | `HushJSON` | 8 字符，低于 iOS `CFBundleName` 15 字符上限，标题栏与图标标签都不截断 |
| 完整展示名：窗口标题、HTML `<title>`、PWA `name` | `HushJSON: JSON Formatter` | 品牌 + 品类，24 字符符合 App Store 30 字符上限 |
| 隐私政策页标题 | `隐私政策 · Privacy Policy — HushJSON` | 页面性质词在前、品牌名收尾，不取完整展示名 |
| 标识层：GitHub slug、npm / Cargo `name`、Pages 路径、`CACHE_NAME` 前缀 | `hush-json` | 改动会切断 URL / 已装用户升级链，**不随品牌变** |
| Apple Bundle ID | `com.jsonbeautify.desktop.appstore[.ios]` | Apple 永久锁定，与品牌无关 |

> 窗口标题**不随语言切换**，各语言共用同一份品牌串。测试对此有断言（`tests/layout.spec.mjs`）。
> 三层故意不一致是**设计而非遗留**：品牌只存在于展示层，因此改品牌不动 URL、包名与升级链。
> App Store 上架名（`HushJSON: JSON Formatter`）在 App Store Connect 元数据里设置，仓库不承载该字段。
