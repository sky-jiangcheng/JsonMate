# User Instruction Memory

This file records user instructions, preferences, and teachings for reference in future interactions.

## Format

### User Instruction Entry
User instruction entries should follow this format:

[User Instruction Summary]
- Date: [YYYY-MM-DD]
- Context: [Mentioned scenario or time]
- Instructions:
  - [Content of user teaching or instruction, described line by line]

### Project Knowledge Entry
Entries discovered by the Agent during task execution should follow this format:

[Project Knowledge Summary]
- Date: [YYYY-MM-DD]
- Context: Discovered by Agent while performing [specific task description]
- Category: [Operations & Deployment|Build Methods|Testing Methods|Troubleshooting & Debugging|Workflow & Collaboration|Environment Configuration]
- Instructions:
  - [Specific knowledge points, described line by line]

## Deduplication Strategy
- Before adding a new entry, check for similar or identical instructions.
- If a duplicate is found, skip the new entry or merge it with the existing one.
- When merging, update the context or date information.
- This helps avoid redundant entries and keeps the memory file tidy.

## Entries

[User Instruction Summary]
- Date: 2026-09-15
- Context: 代码评审修复与 i18n 布局兼容任务
- Instructions:
  - 改代码保持最小改动原则（"一定要谨慎，没必要动的就不动"）：只修确认过的问题，跳过顺手重构、死代码清理等非必要改动，需产品决策的事项先列出选项再动

[Project Knowledge Summary]
- Date: 2026-09-15
- Context: Discovered by Agent while performing i18n 布局溢出修复的验证工作
- Category: Environment Configuration
- Instructions:
  - 本开发环境无 Chrome/chromium，playwright-core 拉不起浏览器，tests/layout.spec.mjs 无法在会话内运行，需要用户在本地环境跑
  - 会话内的替代验证方法：node --check 校验 JS、CSS 花括号配平计数、对 dist 产物写内联 node 正则断言、跑 node scripts/build.js 和 node scripts/pre-commit-check.js（husky 预提交也会跑后者）

[Project Knowledge Summary]
- Date: 2026-09-15
- Context: Discovered by Agent while user纠正"产品支持5语言下拉切换"，追查历史代码
- Category: Operations & Deployment
- Instructions:
  - 版本线以远程 tag 为准（v1.5.65 → v1.5.71），v1.5.69 = 5 语言版（zh/en/es/de/ja，系统语言检测）；2026-09-15 起 main 已与发布线对齐，此后 main 为权威开发线，tag 随版本发布打
  - 后续开发/修复基于 main 最新提交，发布时 bump-version.js 推进版本并打对应 tag（release.yml 的 version-gate 校验 tag 与版本文件一致）
  - 语言切换 UI 是 JS 动态生成的 #lang-menu（app.js ensureLangMenu），挂在 body 层、position:fixed 定位，在 index.html 里搜 <select> 是搜不到的；顶栏 .toolbar 的 overflow-x:auto 滚动方案与它兼容（不会被裁剪）
  - release.yml 的 iOS 图标熔断是内容校验（appiconset 与 src-tauri/icons/ios 产物 cmp 一致 + 1024x1024 尺寸 + hasAlpha=no），基于体积的旧判据会误杀 v1.5.67 起的扁平小图标（~78KB）
  - 图标 alpha 双重约束矩阵（v1.5.72/73 两次事故教训）：Tauri 的 tauri.ios.conf.json bundle.icon 列表经 generate_context! 编译期校验，列表内 PNG 必须为 RGBA（否则 cargo panic "icon ... is not RGBA"）；Apple 90717 只要求 large app icon（1024，AppIcon-512@2x.png）无 alpha。落地方式：14 个小图标保持 RGBA，仅 1024 由 generate-icons.js flatten 为 RGB，并把 1024 从 bundle.icon 列表移除（Xcode 实际用 Assets.xcassets，该列表只服务 generate_context 嵌入）
  - 基于 v1.5.65 做的第一轮修复保留在 git stash（"v1.5.65-based fixes"）和 /tmp/opencode/backup-v1.5.65-fixes/，正式修复已移植到 main（v1.5.70 起）
  - 推送需用户 token（凭据助手 500 不可用）：写入 /root/.netrc（machine github.com login x-access-token password <token>，chmod 600），推完立即清除；清除用 `;` 而非 `&&` 连接——.netrc 只剩 github.com 一行时 `grep -v` 无输出、退出码 1，&& 链静默中断导致清理未执行（2026-09-19 教训）；用户 token 会轮换，旧 token 401 时直接要新的
  - 隐私政策页在 src/privacy.html（中英双语），经 build.js 进 dist/，Pages URL: https://sky-jiangcheng.github.io/advanced-json-formatter/privacy.html（注意 Pages 路径必须与仓库名完全一致：advanced-json-formatter），App Store 隐私政策 URL 字段引用它；docs/ 每次部署整目录重建，站内新增页面必须走 src→dist 链路

[Project Knowledge Summary]
- Date: 2026-09-25
- Context: Discovered by Agent while renaming product to JsonMate; user corrected App Store Bundle IDs
- Category: Operations & Deployment
- Instructions:
  - 产品展示名是 Advanced JSON Formatter（窗口标题与图标短名 JSON Formatter，包名 advanced-json-formatter）；GitHub 仓库为 sky-jiangcheng/advanced-json-formatter，Pages 路径为 /advanced-json-formatter/
  - Apple 锁死的 Bundle ID 是 jsonbeautify，不是 jsonnest：macOS App Store `com.jsonbeautify.desktop.appstore`，iOS App Store `com.jsonbeautify.desktop.appstore.ios`
  - 对应文件：src-tauri/tauri.appstore.conf.json、src-tauri/tauri.ios.conf.json、src-tauri/Entitlements.plist（application-identifier 前缀 Team ID M3A6LK593A）、.github/workflows/release.yml 的 exportOptions.plist provisioningProfiles key
