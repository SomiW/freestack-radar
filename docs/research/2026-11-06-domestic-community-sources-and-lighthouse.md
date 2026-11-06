# 国内大厂开发者社区高信噪比来源接入与腾讯云 WorkBuddy × Lighthouse 福利核实

- **任务范围**：按用户确认的「国内大厂开发者社区高信噪比监控建议」接入 5 个国内云厂商开发者社区入口（官方活动导航 + 官方认证团队 UID / 核心产品标签关键词过滤），并将实测发现的《【WorkBuddy × 腾讯云 Lighthouse】腾讯轻量云专家上线，免费领取一个月轻量应用服务器》核实入库。
- **UTC 时钟**：`2026-11-06T03:12:00Z`（北京时间 `2026-11-06 11:12:00`）
- **基线源 SHA**：`9fb7a87`（main；未跟踪 `.claude/`、`.workbuddy/`、`live.html` 保持原样）

## 1. 来源实测与高信噪比准入结果

选取 5 个国内大厂开发者社区入口，成功 5 / 失败 0 / 未读取 0。严格执行「不抓全站水文流，只抓官方活动位与官方团队 UID / 标题关键词」原则：

| 来源 ID | 名称 | URL | 方法 | 结果与解析说明 |
| --- | --- | --- | --- | --- |
| `tencent-dev-lighthouse` | 腾讯云开发者社区 · 腾讯轻量云官方号 | `https://developer.cloud.tencent.com/user/8307438/articles` | `curl` SSR HTML | HTTP 200（104 KB），官方认证账号（`authorType="O"`，UID `8307438`），20 篇官方文章直出，首条命中 `article/2727729`（WorkBuddy × Lighthouse 免费领 1 个月轻量服务器） |
| `tencent-dev-workbuddy-tag` | 腾讯云开发者社区 · WorkBuddy 产品标签 | `https://developer.cloud.tencent.com/tag/18238?entry=article` | `curl` SSR HTML | HTTP 200（107 KB），`section.com-article-panel-v2` 提取 19 篇最新帖，命中混元 Hy4/Hy3 在 WorkBuddy 11.4–11.15 限时免费（0.00x 倍率）等线索 |
| `aliyun-developer` | 阿里云开发者社区（首页活动与试用导航） | `https://developer.aliyun.com/` | `curl` SSR HTML | HTTP 200（201 KB），首屏提取千问 AI 双 11 Token Plan、模型体验、学生 19 元云服务器包与 `free.aliyun.com` 免费试用入口 |
| `huaweicloud-bbs` | 华为云开发者社区论坛（焦点活动与体验官） | `https://bbs.huaweicloud.com/` | `curl` SSR HTML | HTTP 200（113 KB），首屏提取「10亿Tokens免费领」（`developer.huaweicloud.com/grow`）、0 元开发者认证与产品体验官（`experience-officer.html`） |
| `volcengine-developer` | 火山引擎 Agent 开发者社区 | `https://developer.volcengine.com/` | `curl` SSR HTML | HTTP 200（163 KB），首屏提取 AI 大模型体验中心（`exp.volcengine.com`）与 Agent 评测集入口 |

## 2. 候选发现、去重与入库

- **新发现 2 / 排除 1 / 入库 1**：
  1. **入库（`active` / `high`）**：`tencent-lighthouse-workbuddy-expert-free-1m-2026`
     - 原始标题：【WorkBuddy × 腾讯云 Lighthouse】腾讯轻量云专家上线，免费领取一个月轻量应用服务器
     - 发现链接：`https://developer.cloud.tencent.com/user/8307438/articles`
     - 官方入口：`https://developer.cloud.tencent.com/article/2727729`
     - 核心事实：腾讯轻量云官方账号（UID `8307438`，`authorType="O"`）发布，活动期 `2026-08-13 00:00:00` 至 `2026-11-13 23:59:59`；WorkBuddy 个人版用户在「成长计划」领任务、完成腾讯云 OAuth 授权并与「腾讯轻量云专家」完成 1 次对话，可 0 元新购 2核2G4M 轻量服务器 1 个月（北京/上海/广州，首表写 400 台/日、规则段写 900 台/日）或 0 元续费已有 2核2G4M / 4核4G3M 实例 1 个月（各 50 台/日，每日 0 点刷新，二选一，同实名限 1 次）。
  2. **留待后续官方核实（未入库）**：WorkBuddy / CodeBuddy 接入腾讯混元 Hy4 / Hy3 限时免费（`2026-11-04` 至 `2026-11-15 23:59`，0.00x 倍率每日赠送免费额度）
     - 发现链接：`https://developer.cloud.tencent.com/tag/18238?entry=article`（`article/2775905`、`article/2776053`）
     - 暂不入库原因：两篇均为社区个人作者实测帖（`authorType="N"`），客户端内弹窗的免费额度具体上限尚未在 `workbuddy.cn` 或 `codebuddy.cn` 公开静态网页披露，且 `codebuddy-cn-free-500-credits-2026` 已覆盖体验版全模型限免，避免无独立官方页面支撑下重复拆条。

## 3. 存量 24 小时复核扫描

- 当日 `01:41:41Z` 已完成全量 80 条到期活动复核；本轮 `03:12:00Z` 扫描 `dueActiveResources` 为 **0 条到期**，无复核积压。

## 4. 校验与交付状态

- 运行 `npm run check`（含 `validate:data`、单元测试、TypeScript 类型检查与 Vite 生产构建）：121 条正式资源、96 个来源定义全部通过。
- 本地文件已更新，等待用户进一步指示是否提交推送或直接生成 OpenPick「情报」贴图。
