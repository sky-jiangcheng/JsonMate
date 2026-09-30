# HushJSON: JSON Formatter

> 🌐 [English](README.md) · **简体中文**

一个现代化的 JSON 格式化、压缩、验证与对比工具。**纯前端、零后端、零数据上传**,支持 Web / 桌面端 / iOS,内置 5 种界面语言。

> **在线使用** → [sky-jiangcheng.github.io/hush-json](https://sky-jiangcheng.github.io/hush-json/)

[![Pages](https://github.com/sky-jiangcheng/hush-json/actions/workflows/pages.yml/badge.svg)](https://github.com/sky-jiangcheng/hush-json/actions/workflows/pages.yml)
[![Release](https://img.shields.io/github/v/release/sky-jiangcheng/hush-json?label=release&color=blue)](https://github.com/sky-jiangcheng/hush-json/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Tauri](https://img.shields.io/badge/Tauri-v2-24C8DB?logo=tauri&logoColor=white)](https://tauri.app)

---

## 目录

- [核心特性](#核心特性)
- [界面语言](#界面语言)
- [截图](#截图)
- [快速开始](#快速开始)
- [运行测试](#运行测试)
- [桌面应用与 iOS](#桌面应用与-ios)
- [离线可用 (PWA)](#离线可用-pwa)
- [隐私](#隐私)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [构建与部署链路](#构建与部署链路)
- [文档索引](#文档索引)
- [贡献](#贡献)
- [许可证](#许可证)

---

## 核心特性

### 🔧 JSON 处理

| 功能 | 说明 |
|------|------|
| **格式化** | 2 空格缩进,语法高亮,可交互的树形视图 |
| **压缩** | 单行紧凑输出 |
| **转义 / 反转义** | JSON 字符串转义处理 |
| **自动修复** | 缺失括号自动补全,未加引号的键名自动修复 |
| **实时验证** | 红灯 / 绿灯指示 JSON 有效性(400ms 防抖) |

### 🌲 交互式 JSON 树

- 对象 / 数组节点可展开、折叠(`▼` / `▶` 切换)
- 折叠时显示节点摘要(`{3 键}` / `[5 项]`)
- 行号列随主区同步滚动

### 📋 列表 / 详情视图

- 数组类型 JSON 自动切换为左右分栏模式
- 左侧列表项带预览摘要,点击切换右侧详情
- 列表面板可折叠

### 🔄 JSON 对比

- **结构化递归比对**,而非文本行比对,按键 / 索引匹配
- 差异高亮:🟢 新增 · 🔴 删除 · 🟡 修改
- 左右双树独立渲染,各自保留展开 / 折叠交互
- 滚动同步,支持交换左右

### 📜 历史记录

- 格式化后可保存到本地历史(`localStorage`)
- 点击历史记录自动加载并格式化
- 最多同时选中 2 条进行对比
- 侧边栏可折叠

### 🎨 主题

- 🌙 暗色模式(GitHub Dark)
- ☀️ 亮色模式(GitHub Light)
- 偏好存入 `localStorage`,刷新后保持

### ⌨️ 快捷键

| 快捷键 | 操作 |
|--------|------|
| `Ctrl` / `Cmd` + `Enter` | 格式化 |
| `Ctrl` / `Cmd` + `S` | 保存到历史 |
| `Ctrl` / `Cmd` + `D` | 下载 JSON 文件 |
| `Escape` | 关闭弹窗 / 对比视图 |

### 📎 拖放

支持拖拽 `.json` 文件到输入区域,自动加载并格式化。

---

## 界面语言

内置 **5 种界面语言**,首次访问按 `localStorage 偏好 → 系统语言 → 英文` 的顺序解析,可在右上角语言菜单随时切换,选择结果持久化。

| 语言 | 代码 |
|------|------|
| 中文 | `zh` |
| English | `en` |
| Español | `es` |
| Deutsch | `de` |
| 日本語 | `ja` |

> 窗口标题固定为 `HushJSON: JSON Formatter`、页头 Logo 与图标标签固定为 `HushJSON`(均不随语言切换)。品牌与品类分离:品牌负责被记住,品类词负责被搜索命中。测试对 `document.title` 有断言。

---

## 截图

### 📱 手机端

| 空状态首页 | 格式化成功 | 非法输入 |
|:---:|:---:|:---:|
| ![空状态](screenshots/phone/json-empty-state.jpg) | ![格式化成功](screenshots/phone/format-success.jpg) | ![非法输入](screenshots/phone/invalid-json-input.jpg) |

| 错误提示 | 更多操作弹窗 |
|:---:|:---:|
| ![错误提示](screenshots/phone/invalid-json.jpg) | ![更多操作](screenshots/phone/more-action-menu.jpg) |

### 📟 iPad 竖屏

| 空状态首页 | 格式化结果 | 对比视图 | 历史记录 |
|:---:|:---:|:---:|:---:|
| ![空状态](screenshots/ipad-portrait/screen-01.png) | ![格式化](screenshots/ipad-portrait/screen-02.png) | ![对比](screenshots/ipad-portrait/screen-03.png) | ![历史](screenshots/ipad-portrait/screen-04.png) |

| 更多操作 |
|:---:|
| ![更多操作](screenshots/ipad-portrait/screen-05.png) |

> 截图源文件见 [`screenshots/`](screenshots/) 目录,按平台分 `phone/` 与 `ipad-portrait/` 子目录。

---

## 快速开始

### 环境要求

| 平台 | 依赖 |
|------|------|
| macOS | Xcode Command Line Tools |
| Linux | `sudo apt install libwebkit2gtk-4.1-dev libgtk-3-dev libglib2.0-dev librsvg2-dev` |
| Windows | Visual Studio C++ Build Tools + WebView2 |

Node.js 20+。

### 仅跑网页版(最快)

无需 Rust 与 Tauri,克隆后:

```bash
npm install
npm run build:dist      # 生成 dist/
npm run preview         # 启动静态服务器
```

然后打开 **<http://localhost:8000/src/>**。

> `npm run preview` 执行的是 `python3 -m http.server 8000`,服务的是**仓库根目录**,所以应用位于 `/src/` 而不是根路径。想预览 `dist/` 构建产物,访问 <http://localhost:8000/dist/>。

### 桌面开发模式

```bash
npm install
npm run dev             # tauri dev,带热重载
```

---

## 运行测试

项目使用 Playwright 驱动的测试,走系统 Chrome(`channel: 'chrome'`),**无需** `npx playwright install`。共 3 个 spec:布局冒烟(响应式断点、i18n 切换、主题持久化)、输出区状态机与 Tauri 环境探测。

```bash
npm install
node scripts/build.js             # spec 读取 dist/,必须先构建
node tests/layout.spec.mjs
node tests/output-state.spec.mjs
node tests/tauri-detection.spec.mjs
```

> 仓库**没有** `npm test` 脚本。CI(`Layout Smoke Tests` 工作流)按上面同样的顺序执行。

修改 `src/` 下的布局或样式后请务必跑一遍。详见 [ARCHITECTURE.md](ARCHITECTURE.md#10-测试策略)。

---

## 桌面应用与 iOS

通过 Tauri v2 打包为原生应用。推送 `v*` tag 后由 CI 自动构建、签名并上架:

| 平台 | 打包器 | 产物 |
|------|--------|------|
| macOS | Tauri v2 | `.dmg` / `.app` / App Store `.pkg` |
| Windows | Tauri v2 | NSIS 安装包 `.exe`(**不提供 `.msi`**) |
| Linux | Tauri v2 | `.deb` / `.rpm` / `.AppImage` |
| iOS | Tauri v2 (iOS) | App Store / TestFlight |

### 本地构建

```bash
npm run build          # 桌面全量构建
npm run build:macos    # macOS universal-apple-darwin
npm run build:appstore # macOS App Store .pkg
```

产物位于 `src-tauri/target/release/bundle/`。

### 命名分层

产品在不同位置刻意使用不同的名字:

| 位置 | 取值 |
|------|------|
| 品牌名(`productName`、PWA `short_name`、页头 Logo、iOS/macOS 图标标签、水印默认值) | `HushJSON` |
| 完整展示名(窗口标题、HTML `<title>`、PWA `name`) | `HushJSON: JSON Formatter` |
| 隐私政策页标题 | `隐私政策 · Privacy Policy — HushJSON` |
| 仓库与包标识(GitHub slug、npm / Cargo `name`、Pages 路径、`CACHE_NAME` 前缀) | `hush-json` |
| App Store 上架名 | `HushJSON: JSON Formatter`(在 App Store Connect 元数据里设置,**不由仓库承载**) |

> **Bundle ID 永不随品牌改动** —— `com.jsonbeautify.*` 已被 Apple 锁定,变更会切断升级识别链。
> 因此"展示名 / 包标识 / Bundle ID"三层**有意不一致**:品牌只存在于展示层,改品牌不触碰 URL、
> 包名与已装用户的升级链。

---

## 离线可用 (PWA)

站点是完整的渐进式 Web App:

- `manifest.json` 声明了图标、名称、`display: standalone` 与 `/hush-json/` 作用域
- `sw.js` 实现了 **stale-while-revalidate** 策略:优先返回缓存、后台静默更新
- 缓存键为 `hush-json-v<version>`,随版本号自动失效

在支持的浏览器中可通过「安装到主屏幕」以独立窗口打开,**断网后仍可完整使用** —— 所有 JSON 处理都在本地完成。

---

## 隐私

**没有任何数据离开你的设备。**

- 不发送、不上传、不埋点。应用是纯静态页面,没有后端
- 历史记录与主题偏好仅存于浏览器 `localStorage`
- 唯一的第三方请求是 GitHub Pages 的静态资源托管

完整政策见 [src/privacy.html](src/privacy.html)(应用内「关于」页可访问)。

---

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | 原生 HTML / CSS / JavaScript,**无框架** |
| 状态管理 | 自研 pub/sub store([`src/app/store.js`](src/app/store.js)) |
| 语法高亮 | highlight.js |
| 本地存储 | `localStorage` |
| 桌面 / 移动 | Tauri v2(Rust + WRY) |
| CI/CD | GitHub Actions |

**源码是多模块的,构建产物是单文件。** 开发时按职责拆成 4 个模块,`scripts/build.js` 在构建阶段合并为单个 `dist/app.js`,减少运行时请求数。

---

## 项目结构

```
.
├── src/                       ← 网页应用源码(唯一真源)
│   ├── index.html             #   页面骨架 + 内联关键样式
│   ├── app.js                 #   入口:事件绑定与 i18n 表
│   ├── styles.css             #   主样式
│   ├── styles.mobile.css      #   移动端样式
│   ├── head.js                #   head 注入
│   ├── privacy.html           #   隐私政策页
│   └── app/                   #   业务模块(构建时合并进 dist/app.js)
│       ├── store.js           #     中心状态 + pub/sub
│       ├── actions.js         #     纯业务逻辑,不碰 DOM
│       ├── render.js          #     状态 → DOM 渲染
│       └── router.js          #     设备类型与 UI 层判定
├── scripts/                   ← 构建、版本、图标、上架脚本(15 个)
├── tests/layout.spec.mjs      ← 布局冒烟测试
├── src-tauri/                 ← Tauri 桌面 / iOS 工程(Rust)
│   ├── src/                   #   Rust 源码(lib.rs / main.rs)
│   ├── capabilities/          #   权限声明(core:default only)
│   ├── tauri.*.conf.json      #   3 套平台配置
│   ├── gen/apple/             #   Xcode 工程(由 tauri ios init 生成,不入库)
│   └── target/                #   Rust 构建产物(已忽略)
├── screenshots/               ← 截图源文件
│   ├── phone/
│   └── ipad-portrait/
├── dist/                      ← 网页构建产物(已忽略)
├── docs/                      ← GitHub Pages 产物(CI 生成,勿手改)
├── .github/workflows/         ← 4 个工作流
├── .monkeycode/docs/          ← 项目内部文档(开发日志、里程碑、优化指南)
├── CHANGELOG.md               ← 版本变更记录
├── ARCHITECTURE.md            ← 架构说明
├── CONTRIBUTING.md            ← 项目规范与贡献指南
└── LICENSE                    ← MIT
```

---

## 构建与部署链路

| 目标 | 触发 | 源 → 产物 |
|------|------|-----------|
| 网页 dist | `npm run build:dist` | `src/` + 根静态资源 → `dist/` |
| GitHub Pages | push `main` | `src/` → `docs/`(CI 自动提交) |
| 桌面 / iOS 发布 | push `v*` tag | 全仓 → 安装包 / IPA / PKG,上传 App Store |

> ⚠️ **`docs/` 是 CI 生成产物,不要手动编辑** —— `pages.yml` 每次部署会 `rm -rf docs` 后重建,手改必被覆盖。

---

## 文档索引

| 文档 | 内容 |
|------|------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | 模块职责、数据流、状态管理、测试策略 |
| [CONTRIBUTING.md](CONTRIBUTING.md) | 目录归属、构建链路、版本规范、CI 踩坑记录 |
| [CHANGELOG.md](CHANGELOG.md) | 版本变更记录 |
| [SECURITY.md](SECURITY.md) | 漏洞上报流程与支持版本 |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | 社区行为规范 |
| [src/privacy.html](src/privacy.html) | 隐私政策(应用内可访问) |
| [.monkeycode/docs/](.monkeycode/docs/) | 内部文档:开发日志、里程碑、优化指南、审核回复 |

---

## 贡献

欢迎提交 Issue 与 Pull Request。开始前请阅读 **[CONTRIBUTING.md](CONTRIBUTING.md)**,其中定义了目录归属、版本一致性要求与提交规范。

---

## 许可证

[MIT](LICENSE) © sky-jiangcheng
