# 更新日志

本文件记录 Advanced JSON Formatter 的所有版本变更。

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循[语义化版本](https://semver.org/lang/zh-CN/)。

> 项目历经多次更名：`JsonBeautify` → `JsonNest` → `JsonMate` → `advanced-json-formatter`（2026-09-29）。
> Bundle ID 始终保持不变。

---

## [appstore] - 2026-07-04

### Added
- 完善 App Store 上架自动化（构建脚本 + CI + 配置文件对齐） Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 添加 macOS App Store 上架配置 (entitlements + 构建脚本) Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 输入面板新增错误显示区域，替代 header 中拥挤的错误文字 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 优化 JSON 错误提示，支持自动修复未加引号标识符
- 添加 Tauri v2 桌面应用打包支持
- 添加缩进切换、文件上传、JSON转义和实时验证功能 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 添加 PWA 支持，支持离线使用和安装到桌面 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 暗色/亮色主题切换,localStorage持久化,highlight.js随主题切换 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 非列表JSON输出也使用可交互collapsible树形视图 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 结构化JSON比对(vs文本行比对),递归diff+左右树对齐+diff高亮 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 列表详情支持交互式JSON树，对象/数组字段可手动折叠展开 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 列表栏支持手动展开/收缩切换 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 输出区分隔报错/内容,左窄右宽拆屏,JSON数组列表/详情分栏展示 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- refine UI with SVG icons, line numbers, GitHub-dark inspired theme Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- UI redesign with enhanced visual effects

### Changed
- 移除缩进下拉框及相关代码，统一使用 2 空格缩进 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 优化 logo 图标为填充式花括号 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 比对算法从O(n*m)降为O(n+m)顺序匹配,修复大JSON比对卡顿 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- CI / 构建流水线修复（4 项）

### Fixed
- Entitlements 文件权限改为 read-write（支持导出文件） Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 修正 App Store 版本 identifier（区分免费版） Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 修复 showToast XSS 漏洞，用户输入转义 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 修复图标内容（恢复 'J' 文字样式 + 标准边距） Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 重新生成 macOS 图标（增加标准边距 + 多尺寸） Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 输入面板只保留红绿灯状态，具体错误信息仅在格式化时输出区显示 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 优化深色模式对比度，输入框占位符文字更清晰 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 优化浅色模式可读性，清空按钮同步清除输入区错误提示 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 重构错误提示为内联显示，消除重复堆叠通知
- Tauri 构建配置修复，.deb/.rpm 打包成功 (3.3MB 二进制/1.4MB 安装包) Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 缩进切换改为文本视图显示，修复下拉框无效果的问题 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 使用系统等宽字体渲染图标替代几何图形，升级 v11 缓存 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 修正 J 图标几何形状，确保完整显示 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 用几何图形绘制 J 图标替代字体渲染，修复黑屏问题 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 分离 any/maskable 图标，maskable 用完整填充背景图标避免圆形裁剪变形 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 恢复 maskable 图标目的，升级到 v7 缓存 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 移除 maskable 图标目的属性，升级到 v6 缓存 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 升级缓存版本 v5，manifest 图标添加版本号打破 PWA 缓存 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 简化 PWA 图标，移除渐变和 transform 避免渲染异常 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 压缩/转义以纯文本显示，缩进切换基于已解析对象而非重新解析输入 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 压缩和转义功能添加自动补全括号逻辑，与格式化行为一致 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 缩进下拉框添加 onchange 自动重新格式化，不再需要手动点击格式化按钮 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- favicon 添加版本号参数避免浏览器缓存旧图标 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 添加 32x32 PNG favicon，统一地址栏与 PWA 图标风格 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 更新 PWA 图标为与 logo 一致的填充式花括号设计，升级缓存版本 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 比对改用独立双树渲染,保留collapsible特性,修复内容丢失+对象展开 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 比对先弹出界面显示"正在比对"再异步计算,不阻塞UI Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 展开按钮内嵌detail面板+textarea/output-wrap用absolute定位确保滚动 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- textarea改用flex:1自适应高度,添加min-height:0确保滚动链 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 列表展开按钮改用纯CSS控制显隐,移除inline style冲突 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 修复输出面板多余div导致布局崩裂,侧边栏消失 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 修复输出区无滚动、flex高度约束,列表详情双滚动条 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>

## [1.0.0] - 2026-06-29

内部维护与版本同步，无用户可见变更。

---

## [1.1.0] - 2026-06-29

### Added
- 添加缩进切换、文件上传、JSON转义和实时验证功能 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>

### Changed
- 优化 logo 图标为填充式花括号 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>

### Fixed
- favicon 添加版本号参数避免浏览器缓存旧图标 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 添加 32x32 PNG favicon，统一地址栏与 PWA 图标风格 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 更新 PWA 图标为与 logo 一致的填充式花括号设计，升级缓存版本 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>

---

## [1.2.0] - 2026-06-30

### Fixed
- 使用系统等宽字体渲染图标替代几何图形，升级 v11 缓存 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 修正 J 图标几何形状，确保完整显示 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 用几何图形绘制 J 图标替代字体渲染，修复黑屏问题 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 分离 any/maskable 图标，maskable 用完整填充背景图标避免圆形裁剪变形 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 恢复 maskable 图标目的，升级到 v7 缓存 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 移除 maskable 图标目的属性，升级到 v6 缓存 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 升级缓存版本 v5，manifest 图标添加版本号打破 PWA 缓存 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 简化 PWA 图标，移除渐变和 transform 避免渲染异常 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 压缩/转义以纯文本显示，缩进切换基于已解析对象而非重新解析输入 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 压缩和转义功能添加自动补全括号逻辑，与格式化行为一致 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 缩进下拉框添加 onchange 自动重新格式化，不再需要手动点击格式化按钮 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>

## [1.2.1] - 2026-07-03

### Added
- 添加 macOS App Store 上架配置 (entitlements + 构建脚本) Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 输入面板新增错误显示区域，替代 header 中拥挤的错误文字 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 优化 JSON 错误提示，支持自动修复未加引号标识符
- 添加 Tauri v2 桌面应用打包支持

### Changed
- 移除缩进下拉框及相关代码，统一使用 2 空格缩进 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>

### Fixed
- 输入面板只保留红绿灯状态，具体错误信息仅在格式化时输出区显示 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 优化深色模式对比度，输入框占位符文字更清晰 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 优化浅色模式可读性，清空按钮同步清除输入区错误提示 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 重构错误提示为内联显示，消除重复堆叠通知
- Tauri 构建配置修复，.deb/.rpm 打包成功 (3.3MB 二进制/1.4MB 安装包) Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 缩进切换改为文本视图显示，修复下拉框无效果的问题 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>

## [1.2.10] - 2026-07-03

### Changed
- CI / 构建流水线修复（4 项）

### Fixed
- 修复图标内容（恢复 'J' 文字样式 + 标准边距） Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 重新生成 macOS 图标（增加标准边距 + 多尺寸） Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>

---

## [1.3.0] - 2026-07-15

### Added
- 添加 Capacitor iOS App Store 构建 + GitHub Actions iOS 自动上传流程
- 全面重构移动端 UI - 精简工具栏、设计菜单、优化图标
- 重构移动端布局，适配 iPhone/iPad 竖屏
- 完善 App Store 上架自动化（构建脚本 + CI + 配置文件对齐） Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>

### Changed
- 统一桌面端与移动端 UI 设计语言 — 颜色变量/圆角/按钮反馈 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- App Store 名称改为全英文 JSON Beautify Tool Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- CI / 构建流水线修复（1 项）

### Fixed
- 修复全平台构建失败 - 移除非法 iOS 配置字段和 configPath 参数
- 图标源文件改为 app-icon-source.png，避免被 tauri icon 覆盖 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 统一 App 图标为 PWA 同款 icon.svg，替换 Tauri 和 Capacitor 所有尺寸 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 使用最宽松的 CSP 测试是否是策略导致 onclick 失效 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 回退 JS 诊断代码，CSP 只改 connect-src（加 tauri: ipc: 协议），保留 getIndent 修复 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 放宽 Tauri CSP，允许 tauri: ipc: 协议，修复 WKWebView 上 onclick 失效 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 添加全局 JS 错误捕获 + formatJSON try-catch 以诊断 Tauri 桌面版问题 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 定义缺失的 getIndent() 函数，修复数组类型 JSON 格式化崩溃
- macos-appstore provisionprofile 安装到 src-tauri/ 而非全局目录 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 更新 package-lock.json，Capacitor 移至 dependencies Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 简化 ios-appstore job，Capacitor 已在 dependencies 中 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 将 Capacitor 移至 dependencies，修复 iOS CI npm ci 不安装 devDependencies Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- ios-appstore job 使用直接路径调用 Capacitor CLI Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- highlight.js 本地化，移除 CDN 依赖，修复 Tauri 离线构建失败
- 用 html[data-theme=light] 提高特异性，修复 Safari 主题切换失效 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 移动端菜单主题切换后图标同步更新，初始化也走 applyTheme Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 主按钮改用专用深蓝色变量 --btn-primary-bg，与 GitHub 原色一致 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 修复移动端 toast 弹出提示被 translateX(-50%) 推到屏幕外 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 修复 iOS Safari 树节点点击无效 — 增大 toggle 触控目标 + position:relative 修复点击拦截 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 移动端 body 锁定 100dvh 高度，底部按钮不再被推出屏幕 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- SW v14 强制清除移动端缓存，添加 v9 版本标记 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- header 移动端只显示 3 个按钮（格式化/上传/菜单），主题和历史收入菜单
- 修复移动端面板重叠、标签重复、placeholder 过长
- 移动端样式加 !important 兜底 + SW 缓存版本升级 v13 + 调试标记
- 添加防缓存 meta 标签 + JS 屏幕检测兜底移动端布局
- 修复 iOS/iPad PWA 兼容性问题
- 修复 Tauri 配置文件 schema URL 和 CSP 安全配置
- Entitlements 文件权限改为 read-write（支持导出文件） Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 修复 showToast XSS 漏洞，用户输入转义 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>

## [1.3.1] - 2026-07-15

内部维护与版本同步，无用户可见变更。

## [1.3.2] - 2026-07-18

### Added
- App Rejected: Performance - App Completeness

### Changed
- CI / 构建流水线修复（3 项）

### Fixed
- iOS 用 npx tauri ios build --archive-only 替代 tauri-action Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- iOS 使用 --archive-only + 手动 xcodebuild -exportArchive Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- iOS 使用 --export-options-plist (不带 --) 作为 tauri ios build 直接参数 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- iOS 分离构建和导出步骤，导出使用 xcodebuild -exportArchive Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- iOS 导出添加 exportOptions.plist + 直接调用 tauri ios build Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- iOS CODE_SIGN_IDENTITY 改为 iPhone Distribution + 添加 PROVISIONING_PROFILE UUID Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- Cargo.toml 添加 [lib] crate-type 支持 iOS staticlib 编译 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- iOS 证书支持 IOS_APPLE_CERTIFICATE 优先 + 回退 APPLE_CERTIFICATE Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 回退 iOS bundle ID 为 com.jsonbeautify.desktop.appstore（与 provisioning profile 匹配） Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 修复 getIndent() 缺失 + iOS 构建配置错误
- 证书同步导入 login.keychain + 移除 tauri-action env 中 APPLE_SIGNING_IDENTITY 覆盖
- 自动检测签名身份名称，不再依赖手动配置 APPLE_SIGNING_IDENTITY
- iOS Xcode 工程配置 Development Team 以修复签名失败
- iOS 构建使用正确的 target 参数 (aarch64 而非 aarch64-apple-ios)
- 修复签名身份解析失败 - 添加 keychain 搜索路径和调试输出
- 修复 macOS App Store 和 iOS 构建配置

---

## [1.4.0] - 2026-07-18

### Added
- 国际化支持中英文切换 - 添加 i18n 翻译表（zh/en 各 51 个 key） - 工具栏增加语言切换按钮 EN/中 - data-i18n 属性实现静态 HTML 文本翻译 - JS 动态文本通过 i18n.t() 调用 - 语言偏好持久化到 localStorage，默认跟随浏览器 - 切换语言时自动刷新输出面板和历史记录 - document.title 和 html[lang] 实时更新 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>

## [1.4.2] - 2026-07-18

### Added
- App Rejected: Performance - App Completeness

### Changed
- CI / 构建流水线修复（4 项）

### Fixed
- 添加 iOS apple-mobile-web-app-capable 等 meta 标签

## [1.4.3] - 2026-07-18

### Changed
- CI / 构建流水线修复（1 项）

## [1.4.4] - 2026-07-18

### Added
- App Rejected: Performance - App Completeness

### Changed
- CI / 构建流水线修复（1 项）

## [1.4.5] - 2026-07-18

### Fixed
- 补全 ICNS 512pt @2x 图标，修复 App Store 上传被拒

## [1.4.6] - 2026-07-18

### Changed
- CI / 构建流水线修复（1 项）

### Fixed
- sync SW v12 in dist
- cache highlight.js in SW v12
- localize highlight.js in dist/index.html
- localize highlight.js (CDN->local) in index.html

## [1.4.7] - 2026-07-18

内部维护与版本同步，无用户可见变更。

---

## [1.5.0] - 2026-07-19

### Added
- 添加版本号同步脚本 scripts/bump-version.js
- add build.py for dist/ generation

### Changed
- 合并移动端样式系统，删除 body.mobile 兜底
- 拆分巨石 index.html 为模块化源文件结构
- split PC/mobile DOM
- split PC/mobile DOM with UA-responsive controls
- sync mobile detection to dist/index.html
- synchronous device detection + comprehensive mobile CSS
- CI / 构建流水线修复（1 项）

### Fixed
- 修复 Code Review v2 发现的全部 15 项问题
- 构建到 docs/ 并提交回 main，Pages 同分支部署
- 恢复 peaceiris 方案（唯一确认正确的部署方式） Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 移除 configure-pages 避免干扰 artifact 路径 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- path: dist (remove ./ prefix) Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 添加 administration: write 权限使 configure-pages 能启用 Pages Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 恢复官方 deploy-pages，补上 id-token: write 权限 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 改用 peaceiris/actions-gh-pages 直接部署 dist/ 到 gh-pages 分支
- 添加 dist/ 文件存在性检查，移除 set -e Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 完善 bash 构建脚本，处理空目录和 glob 边界情况 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- Pages 构建改用纯 bash，避免 Node.js CI 兼容性问题 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- Build 步骤移到 Setup Pages 之前
- 移除 configure-pages 干扰，添加 dist 验证步骤
- 添加 .nojekyll 到仓库根目录，禁用 GitHub Pages Jekyll 处理
- 构建产物添加 .nojekyll 防止 GitHub Pages Jekyll 处理 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 加强移动端检测鲁棒性，修复 iOS 上仍显示 PC 端布局的问题
- 3-signal detection + desktop-only class on header
- clean up !important overrides, restore mobile UI
- correct html.mobile selector syntax (white-screen fix)
- UA-first detection + !important mobile fallback for iOS Safari
- 修复 iOS Safari 显示 PC 端布局的问题
- 补全 ICNS 512pt @2x 图标，修复 App Store 上传被拒

## [1.5.1] - 2026-07-19

### Added
- 移动端"更多"面板补回保存按钮(搭配历史记录)

### Changed
- CI / 构建流水线修复（1 项）

## [1.5.2] - 2026-07-19

### Changed
- CI / 构建流水线修复（1 项）

### Fixed
- 统一三平台图标为源图 app-icon-source 极简J设计

## [1.5.3] - 2026-07-19

### Changed
- 清理死代码/重复资源，建立项目规范

## [1.5.4] - 2026-07-19

### Changed
- CI / 构建流水线修复（1 项）

### Fixed
- add diagnostic output to check-appstore-version.py for 401 debugging +

## [1.5.5] - 2026-07-19

### Fixed
- convert EC DER signature to raw r||s in JWT (Apple requires raw, was 401)

## [1.5.6] - 2026-07-19

### Fixed
- remove unsupported sort parameter from ASC builds API call (400 PARAMETER_ERROR)
- apply sed transformation for docs/ (remove ../)
- restore pre-v13f code (lost 3 commits due to v13f deploy regression)

## [1.5.7] - 2026-07-19

### Changed
- CI / 构建流水线修复（1 项）

## [1.5.8] - 2026-07-19

### Fixed
- unify app icon source (blue J) across all platforms

## [1.5.9] - 2026-07-20

### Fixed
- regenerate all iOS icon sizes from blue-J source via sips (fixes ASC default ring icon)

## [1.5.10] - 2026-07-20

### Fixed
- regenerate ALL platform icons from REAL blue-J source (app-icon-source.png)

## [1.5.11] - 2026-07-20

### Fixed
- 按 marketing version 而非构建号选提交版本，根治 409
- iOS App Store 图标修复——tauri.ios.conf.json 加 bundle.icon、CI 加 npx tauri icon 步骤、generate-icons.js 扩展 iOS 尺寸 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>

## [1.5.12] - 2026-07-21

### Added
- App Rejected: Performance - App Completeness

### Changed
- CI / 构建流水线修复（1 项）

### Fixed
- iOS PWA standalone 模糊修复——viewport 加 minimum-scale+shrink-to-fit、移除 -webkit-overflow-scrolling、优化字体抗锯齿 Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- 修复 safe-area padding 导致的渲染模糊
- 适配 iPhone 刘海/灵动岛 + 工具栏固定底部 + 防溢出
- 被驳回版本重提先删除残留 submission 再创建

## [1.5.13] - 2026-07-21

### Added
- App Store图标显示异常

### Fixed
- submit-appstore-review.py 两处 api_request() 漏传 jwt 参数导致 TypeError Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>
- remove backdrop-filter from drop-overlay hidden state
- remove remaining backdrop-filter from drop-overlay hidden state
- remove backdrop-filter from hidden display:none states
- remove backdrop-filter from hidden display:none states (iOS Safari compositing bug)
- move backdrop-filter to active/open states only
- move backdrop-filter to active/open states only (iOS Safari compositing bug with backdrop-filter on hidden elements)
- add desktop sidebar-overlay hide rule
- remove mobile-only class from sidebar-overlay
- add desktop sidebar-overlay hide rule (was relying on mobile-only class which !important conflict)
- remove mobile-only class from sidebar-overlay (CSS specificity conflict caused always-visible overlay on mobile)
- remove text-rendering optimizeLegibility for iOS text clarity
- add font-smoothing for iOS

## [1.5.14] - 2026-07-23

### Added
- polish motion and micro-interactions
- 移动端UI功能与页面设计Review
- App Store图标显示异常

### Fixed
- landscape bottom blank space
- mobile sidebar footer visible with 100dvh
- lock landscape page scroll and restore border divider
- landscape vertical divider now spans full height
- add touch-action and overscroll-behavior for landscape editor
- mobile landscape toolbar layout and accessibility issues
- sync accessibility and UX improvements to src/

## [1.5.15] - 2026-07-25

### Added
- 移动端UI功能与页面设计Review

## [1.5.16] - 2026-07-26

### Added
- 移动端UI功能与页面设计Review

## [1.5.17] - 2026-08-04

### Added
- default to English language and light theme
- 优化 Seedream 工具图标

## [1.5.18] - 2026-08-05

### Fixed
- improve App Store submit 403 error handling and add export compliance

## [1.5.19] - 2026-08-05

### Fixed
- export compliance API attrs, submission cleanup, set APP_STORE_VERSION

## [1.5.20] - 2026-08-05

### Fixed
- skip versions with stuck submissions, add propagation delay

## [1.5.21] - 2026-08-05

### Fixed
- always create new version with APP_STORE_VERSION + propagation delay

## [1.5.22] - 2026-08-05

### Fixed
- try version relationship endpoint to delete stuck submissions

## [1.5.23] - 2026-08-05

### Fixed
- delete stuck version and create new one on zombie submission

## [1.5.24] - 2026-08-05

内部维护与版本同步，无用户可见变更。

## [1.5.25] - 2026-08-05

### Added
- 创建新标签

### Fixed
- add Info.plist with ITSAppUsesNonExemptEncryption=false

## [1.5.26] - 2026-08-05

### Fixed
- remove Info.plist config key (Tauri auto-discovers src-tauri/Info.plist)

## [1.5.27] - 2026-08-05

### Fixed
- handle WAITING_FOR_REVIEW gracefully, make preflight/encrypt non-fatal

## [1.5.28] - 2026-08-14

### Added
- 优化 Seedream 工具图标

### Fixed
- 修复 JSON 树逗号插入等回归 Bug，并为 Tauri 桌面/iOS 适配原生下载与复制
- 修复上次提交引入的三个回归 Bug
- 修复 JSON 树逗号插入 Bug、废弃 API、拖拽状态卡死及移动端检测死代码等问题
- 修复移动端历史记录功能及PC端CSP/内存泄漏问题

## [1.5.29] - 2026-08-14

内部维护与版本同步，无用户可见变更。

## [1.5.30] - 2026-08-14

### Added
- 为输出面板新增 JSON 搜索/匹配功能

## [1.5.31] - 2026-08-14

### Added
- Linux Deployment Failure

## [1.5.32] - 2026-08-14

### Fixed
- 修复移动端按钮无法点击及输入框自动放大问题

## [1.5.33] - 2026-08-15

### Changed
- 架构拆分 router/store/actions/render，消除移动端耦合问题

## [1.5.34] - 2026-08-15

### Added
- CI/CD pipeline for automatic App Store publishing

## [1.5.36] - 2026-08-16

内部维护与版本同步，无用户可见变更。

## [1.5.37] - 2026-08-16

### Fixed
- hide bottom toolbar when history sidebar is open

## [1.5.38] - 2026-08-16

### Fixed
- add safe-area padding to compare container

## [1.5.39] - 2026-08-16

### Fixed
- compare 界面 Close/Swap 按钮点不动 + 横屏两侧空白
- add safe-area padding to compare container

## [1.5.40] - 2026-08-16

### Fixed
- Format 输出空白 + 历史界面底部空白 + 状态消息残留
- compare 界面 Close/Swap 按钮点不动 + 横屏两侧空白

## [1.5.44] - 2026-08-19

### Added
- 统一项目标识——页面 logo 改用品牌图标(logo.png 同源生成), 替换线性大括号

### Changed
- 移除遗留 Capacitor iOS 工程(ios/), 版本同步收敛为 4 处(Tauri iOS 为上架唯一链路)
- CI / 构建流水线修复（2 项）

### Fixed
- 图标按 2026 Apple 标准重生成（全出血/去alpha/去白边）
- HEIC 解码失败提示 + CFBundleVersion 递增 + README iOS 构建方式修正
- 背景图校验放宽 + 保存失败提示 + 水印深色自适应
- 深度代码审查第三轮修复
- 解决 Service Worker 缓存旧包导致线上"点不动"
- 设备检测缓存 bug 导致移动模式失效/点不动
- 允许保存到任意位置而不全局放开 fs scope
- 修复历史名/文件名的存储与本地文件 XSS
- 深度代码审查第二轮修复
- 修复深度代码审查发现的安全与稳定性问题
- Format 输出空白 + 历史界面底部空白 + 状态消息残留

## [1.5.45] - 2026-08-20

内部维护与版本同步，无用户可见变更。

## [1.5.46] - 2026-08-23

### Fixed
- 恢复 PNG 图标 alpha 通道（满足 Tauri 2 对 Linux 构建的 RGBA 要求）
- 修复图标 alpha 通道问题，解决 macOS 12 显示大正方形

## [1.5.47] - 2026-08-23

### Fixed
- iOS 复选框和历史按钮点击，添加 touchend 事件支持
- iOS 复选框点击失效，添加 touch-action: manipulation
- iOS 历史记录按钮点击失效，添加 touch-action: manipulation

## [1.5.48] - 2026-08-23

### Fixed
- iOS 构建添加并发控制和依赖顺序，避免 macOS runner 资源排队

## [1.5.49] - 2026-08-23

内部维护与版本同步，无用户可见变更。

## [1.5.50] - 2026-08-23

### Fixed
- keep RGBA when generating icons to satisfy tauri generate_context Co-authored-by: monkeycode-ai <monkeycode-ai@chaitin.com>

## [1.5.51] - 2026-08-23

### Fixed
- add missing 1024 marketing icon (AppIcon-512@2x) to bundle.icon for Tauri asset catalog
- remove redundant AppIcon-1024.png, fix icon naming for Tauri v2

## [1.5.52] - 2026-08-23

### Fixed
- landscape edge gap, portrait toolbar dead-space & legacy history load (normalize + Cargo.lock align 1.5.51)

## [1.5.53] - 2026-08-23

### Changed
- CI / 构建流水线修复（2 项）

### Fixed
- overlay bottom toolbar in portrait, extend panel to screen bottom (v13)
- hug output panel to content in portrait (v12)

## [1.5.54] - 2026-08-23

### Changed
- CI / 构建流水线修复（1 项）

### Fixed
- save editor content, overwrite loaded record instead of always creating new

## [1.5.55] - 2026-08-26

### Fixed
- resolve history click TypeError and upgrade bracket repair to stack algorithm
- prevent content drag from covering header and enlarge scrollbars

## [1.5.56] - 2026-08-27

### Fixed
- add NSCameraUsageDescription to prevent Take Photo crash on iOS

## [1.5.57] - 2026-08-28

### Added
- 背景图穿透优化——设置背景图时输入框/输出框自动切换半透明+毛玻璃，背景图自然透出

## [1.5.58] - 2026-08-28

### Added
- 背景图穿透优化——设置背景图时输入框/输出框自动切换半透明+毛玻璃，背景图自然透出

### Fixed
- 移除 tauri.ios.conf.json 无效 bundle.ios 字段, 改用 PlistBuddy 在 CI 中注入 NSCameraUsageDescription

## [1.5.59] - 2026-08-28

### Changed
- CI / 构建流水线修复（1 项）

### Fixed
- i18n 未知语言回退英文与 $ 符号安全替换; 历史 id 属性转义防注入; formatBytes 大单位溢出; SW skipWaiting/claim 移入 promise 链

## [1.5.60] - 2026-08-29

### Fixed
- Tauri 桌面 WebView 强制 desktop, 修复初始化 innerWidth≤900 误判 mobile 导致状态栏消失/长文本底部滚不出

## [1.5.61] - 2026-08-29

### Fixed
- Tauri 桌面门槛附加 hover+fine-pointer 条件, 防止 iPadOS WKWebView 桌面风格 UA 触发强制 desktop 丢失移动端布局; 合并重复 isMobileUA 赋值

## [1.5.63] - 2026-08-30

### Changed
- 移动端设备层样式拆分至 styles.mobile.css
- 设备类别与视口适配分离——detect() 只用稳定信号(UA/hover+pointer), innerWidth 彻底移出设备判定

### Fixed
- 桌面层窄窗布局修复——main-layout ≤900px 转纵向, 侧栏不再挤碎编辑区

## [1.5.64] - 2026-08-30

### Fixed
- UI 层规则修正——桌面浏览器窄窗回退 mobile 层, Tauri 壳锁定 desktop

## [1.5.65] - 2026-08-30

### Fixed
- pre-push 只校验指向 HEAD 的新 tag, 跳过历史 tag
- sync-versions Cargo.lock 正则兼容 CRLF

## [1.5.66] - 2026-09-03

### Fixed
- App Store 桌面壳布局修复（状态栏隐藏 + 长内容顶部菜单消失）

## [1.5.67] - 2026-09-03

### Added
- 升级应用图标（雅黑背景 + 加粗大括号 + 边缘光泽）

## [1.5.68] - 2026-09-03

### Fixed
- 用全幅方形源图重做 macOS .icns，避免 App 图标显示成正方形

## [1.5.69] - 2026-09-04

### Added
- 支持英语/西班牙语/德语/日语切换，默认读取系统语言

## [1.5.70] - 2026-09-15

### Fixed
- 长语言布局兼容 + 代码评审修复

## [1.5.71] - 2026-09-18

### Changed
- CI / 构建流水线修复（1 项）

## [1.5.72] - 2026-09-18

### Fixed
- 图标移除 alpha 通道，修复 App Store 90717 上传失败

## [1.5.73] - 2026-09-18

### Fixed
- 仅 1024 大图标去 alpha，其余 iOS 图标恢复 RGBA

## [1.5.74] - 2026-09-20

### Added
- 适配 iPhone Duo 折叠屏与 iOS 27；MinOS 提升至 15.0
- 新增隐私政策页面（中英双语），供 App Store 元数据引用

### Fixed
- 在线站点链接改为仓库实际大小写

## [1.5.75] - 2026-09-24

### Changed
- 修正长描述 JsonNest 后缺失空格
- rename project JsonBeautify -> JsonNest

### Fixed
- Pages 路径大小写随仓库名改为 /JsonNest/(大小写敏感)

## [1.5.76] - 2026-09-25

内部维护与版本同步，无用户可见变更。

## [1.5.78] - 2026-09-29

### Fixed
- 加固 IPC/CSP/CI 供应链并修复依赖漏洞

## [1.5.79] - 2026-09-29

### Fixed
- manifest start_url/scope 跟随仓库改名 JsonNest -> JsonMate

## [1.5.80] - 2026-09-29

### Changed
- 仓库与 npm / Cargo 包名改名为 `advanced-json-formatter`
- 展示名由 `JsonMate` 改为 `Advanced JSON Formatter`，窗口标题与 PWA 图标标签使用短名 `JSON Formatter`

### Fixed
- 用 `bundle.macOS.bundleName` 钉住 macOS `CFBundleName` 为短名
- 用 PlistBuddy 钉住 iOS `CFBundleDisplayName` / `CFBundleName` 为短名，避免图标标签被截断
- 修复超时分支 `NameError` 并对终态构建快速失败

## [1.5.81] - 2026-09-29

### Fixed
- 历史记录两处会静默丢用户数据的缺陷：往返读取时对首尾为双引号的内容无条件脱一层壳（顶层 JSON 字符串 `"hello"` 被改成非法的 `hello`）；localStorage 配额满时删除整个 `jsonHistory` 键（现改为保留原有数据并向用户明确报错）
- 无 id 的老历史记录每次读取都生成随机 id，导致删除/勾选按 id 比对永不命中（现按内容确定性派生并自动去重）；其兜底启发式还会把 `name`/`label` 误当作 JSON 内容
- 带 BOM 的输入被误报为「JSON 无效」（Windows 工具导出的 `.json` 常见）
- 解析错误页残留：错误态此前绕过 store 直接写 DOM，「格式化 A 成功 → 改坏失败 → 改回 A 再成功」时页面停在错误视图；现纳入单向数据流，并在切换语言时同步重画错误提示
- `diffJson` 用 `key in obj` 判键，`{"toString":...}` 这类合法 JSON 产生幻影 changed 且对应行渲染为空白
- 首次访问把语言持久化成 `en`，刷新一次就覆盖系统语言
- 拖拽 `.JSON` 大写后缀文件被拒（macOS 上常见且 MIME 常为空）
- 清空编辑器后再保存会静默覆盖原先载入的那条历史记录
- 移动端 `viewport` 的 `user-scalable=no` 导致无法双指缩放
- 上架作业用 `github.ref_name` 当版本号：push `appstore` 分支时它是字面量 `"appstore"`，导致版本重复检查查错对象、提交审核空等数十分钟（现由 `version-gate` 从 `version.json` 解析后透传）
- Pages 部署用 `cp -r dist/*` 漏掉点号文件，`build.js` 写入的 `.nojekyll` 从未进 `docs/`
- 版本一致性门禁不含 `version.json`，而构建以它反向覆写其余文件（改齐其余处却漏改它时门禁放行、版本被静默回退）

### Changed
- 删除全仓无引用的 `tauri.desktop.conf.json` / `tauri.mobile.conf.json` 两套死配置，并移出版本同步清单（平台配置由 5 套收敛为 3 套）
- 渲染大 JSON 时复用 store 中已解析的对象，不再每次重新 `JSON.parse`
- 移除 `_platform` 的 localStorage 写入（全仓无读取方）
- 文档套件补齐（ARCHITECTURE / SECURITY / CODE_OF_CONDUCT / Issue 模板）并修正改名后多处与实际仓库不符的描述

### Tests
- 新增 `tests/output-state.spec.mjs`（错误态端到端 + `diffJson` 源码级校验）
- `scripts/test-tauri-detection.js` 移入 `tests/tauri-detection.spec.mjs`（转 ESM、自带静态服务，不再依赖外部 `:8765`）
- CI `Layout Smoke Tests` 现依次执行三个 spec；此前测试命令是逐文件写死的，新增 spec 不接线就不会跑

## [1.5.82] - 2026-09-30

### Changed
- 品牌名由 `Advanced JSON Formatter` 改为 **`HushJSON`**，完整展示名为 **`HushJSON: JSON Formatter`**（24 字符，符合 App Store 30 字符上限）
- 命名分层重排：`productName` / 页头 Logo / 图标标签 / PWA `short_name` / 水印默认值取短品牌 `HushJSON`；窗口标题 / HTML `<title>` / PWA `name` / 隐私政策取完整展示名
- 图标标签与 `CFBundleName` 从 `JSON Formatter` 变为 `HushJSON`（8 字符，此前 23 字符的完整名会被系统截断成 `Advanced JSON...`）；`release.yml` 里的 PlistBuddy 改写与归档断言同步更新，改写机制保留但理由改为"钉成确定值并复验"
- README / ARCHITECTURE / CONTRIBUTING / SECURITY 的命名分层表按新事实重写

### Fixed
- 隐私政策里残留的最早一代名称括注 `（JSON Beautify Tool）` 已移除

### Notes
- **标识层刻意不动**：GitHub slug、npm / Cargo `name`、Pages 路径、`sw.js` 的 `CACHE_NAME` 前缀仍为 `advanced-json-formatter`；Apple Bundle ID 仍为已被锁定的 `com.jsonbeautify.desktop.appstore[.ios]`。因此"展示名 / 包标识 / Bundle ID"三层不一致是设计结果，改品牌不再牵动 URL、包名与已装用户升级链
- App Store 上架名需在 App Store Connect 元数据里改为 `HushJSON: JSON Formatter`，该字段不由仓库承载
- 已在设置里保存过水印文字的老用户，其 `localStorage.appSettings.watermarkText` 仍是旧值（该字段用户可编辑，不做迁移）

