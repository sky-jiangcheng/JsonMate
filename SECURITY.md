# 安全策略（SECURITY）

Advanced JSON Formatter 的安全模型、漏洞上报流程与支持范围。

---

## 支持范围

| 版本 | 状态 | 说明 |
|------|------|------|
| `1.5.80` 及以后 | ✅ 活跃支持 | 接收安全报告与修复 |
| `1.5.79` 及更早 | ⚠️ 仅建议升级 | 不再单独修补，请升级到最新版 |

> 项目尚未开源分发大规模使用，版本推进较快。**发现问题时请先确认最新版是否已修复。**

---

## 报告漏洞

**请勿公开提交安全 Issue。**

用 GitHub 私密漏洞报告渠道：

1. 打开仓库 → **Security** 标签
2. 点击 **Report a vulnerability**
3. 填写漏洞详情

若该入口不可用，可通过仓库主页的联系方式私下联系维护者。

### 报告中请包含

- 受影响版本（网页版 / macOS / Windows / Linux / iOS）
- 复现步骤
- 复现代码或 PoC（JSON 载荷即可）
- 预期与实际行为
- 影响范围评估（数据泄露 / 权限提升 / 拒绝服务 / 其他）

### 我们的承诺

| 阶段 | 时限 |
|------|------|
| 确认收到 | 3 个工作日内 |
| 初步评估与严重级别 | 7 个工作日内 |
| 修复与发布 | 视严重程度，参照下表 |

| 严重级别 | 目标修复时间 |
|----------|--------------|
| 严重（远程代码执行、任意文件读写） | 72 小时内 |
| 高（数据泄露、权限绕过） | 1 周内 |
| 中（可被用户触发的注入 / 越权） | 2 周内 |
| 低（加固建议、纵深防御） | 随下个版本 |

修复后会发布新版本，并在 [CHANGELOG.md](CHANGELOG.md) 标注，同时在报告提交处致谢（若你愿意）。

---

## 安全模型

理解本项目的安全属性有助于判断某个问题是否算漏洞。

### 数据不离开设备

这是产品的核心承诺，而非附加功能：

- **没有后端**。应用是纯静态页面，不存在可被攻击的服务端
- **零遥测**。无埋点、无分析脚本、无崩溃上报
- **无网络请求**。CSP 明确 `connect-src 'self'`，代码层面禁止对外通信
- **无外部 CDN**。`npm run check:cdn` 在提交前扫描，禁止引入任何第三方资源

因此：历史记录、待格式化的 JSON 内容、主题与语言偏好，**只存在于浏览器 `localStorage`**，不会同步到任何服务器。

### 浏览器侧加固

| 项 | 措施 |
|---|------|
| CSP | `script-src 'self'`（**无** `unsafe-inline`）、`object-src 'none'`、`base-uri 'none'`、`frame-ancestors 'none'`、`form-action 'none'`、`connect-src 'self'` |
| 内联脚本 | 全站零内联 `<script>`（这也是 `head.js` 被外置的原因） |
| Tauri 权限 | `core:default` only，`withGlobalTauri: false` |
| 依赖 | 静态资源本地打包，版本随 tag 锁定 |

### Tauri 侧输入边界

所有穿越 WebView 信任边界的输入都做了收敛（`src-tauri/src/lib.rs`）：

- 文件保存与剪贴板写入各有 **8 MiB** 上限
- 传给原生的文件名用 `Path::file_name` 剥掉目录分量，**防止路径穿越**
- 代码签名与 provisioning profile 由 CI 管理，不入库

---

## 不视为漏洞的情况

以下属于**预期行为**，而非安全缺陷：

| 情况 | 说明 |
|------|------|
| 用户把敏感 JSON 粘贴进应用 | 数据只在本机处理，这是设计用途。清除 `localStorage` 即可删除痕迹 |
| 用户在不受信的共享设备上使用 | 与任何本地应用相同，请自行清理浏览器数据 |
| `localStorage` 中的历史记录被同源脚本读取 | 受浏览器同源策略约束，网页版仅同源可读；Tauri 壳内无同源外部脚本 |
| 自动修复功能「修正」了不符合预期的 JSON | 属功能行为，非安全问题。格式错误会导致校验报错而非静默篡改 |
| highlight.js 渲染 JSON 字符串时的显示细节 | 高亮是纯文本渲染，不执行 JSON 内容 |

---

## 自行验证

想验证「不联网」这一承诺：

1. 打开浏览器开发者工具 → **Network** 面板
2. 格式化、对比、保存历史记录
3. 除页面自身的资源加载外，**不应出现任何请求**

检查 CSP 是否生效：

```bash
curl -sI https://sky-jiangcheng.github.io/advanced-json-formatter/ | grep -i content-security-policy
```

Tauri 应用的 CSP 在 `tauri.conf.json` 的 `app.security.csp` 中定义，桌面端与网页端一致。

---

## 相关文档

- [ARCHITECTURE.md](ARCHITECTURE.md) — 安全模型与状态管理的完整说明
- [CONTRIBUTING.md](CONTRIBUTING.md) — CI 上架流程与踩坑记录
- [src/privacy.html](src/privacy.html) — 面向用户的隐私政策
