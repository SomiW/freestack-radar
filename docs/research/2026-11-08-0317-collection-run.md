# 2026-11-08 运行报告：84 条到期复核 + 3 条新增（含 1 条 pending）

## 任务范围 / UTC 时钟 / 环境 / 源 SHA

- 范围：按 `resource-collection-publishing` + `resource-research` 执行一次「正常运行」——扫描全部存量、处理满 24 小时与更早 nextReviewAt 到期者、按默认上限发现最多 3 条新资源、写入 JSON、校验、直推 main 并验收 Pages。
- UTC 时钟：2026-11-08T03:11:12Z（计算队列）/ 写入与证据时间 `checkedAt` 2026-11-08T03:17:24Z—03:2xZ。
- 环境：macOS 本地，Node 22，仓库 `/Users/wang/Projects/freestack-radar`。
- 基线 main：`944e3d0`（docs: record publish result for 21:06Z run）。本轮开始前工作区仅 `.claude/`、`.workbuddy/`、`live.html` 三个未跟踪文件，`data/` 无本地改动，无覆盖风险。

## 来源

选取 20 / 成功 19 / 失败 1 / 未读取（本轮窗口外）若干。

| 来源 | URL | 方法 | 时间(UTC) | 结果 |
| --- | --- | --- | --- | --- |
| perq 12 类目 | `perq.sh/api/search?...&category=*` | json | 03:12 | 全部 200，38 条报价，去重后 10 条候选面值均 <$10 或无条款 |
| usefree | `usefree.space/brands_new.json` | json | 03:12 | 200，110 品牌 / 180 active deal，无足额新候选 |
| tokenpencil | `token.pencilai.top` | html | 03:12 | 200，24 项免费 + 15 项优惠，产出 2 条 active + 1 条 pending 线索 |
| tokentab | `tokentab.cn/deals.html` | html | 03:12 | 200，卡片索引，无新增 |
| aifree / aispoils / freeaiapis | 首页 | html | 03:12 | 200，无新增候选 |
| linux.do 福利区 | `linux.do/c/welfare/36.rss` | rss（浏览器 UA） | 03:12 | 200，帖子以低价 VPS 为主，无可核实新条目 |
| nodeseek | `rss.nodeseek.com` | rss | 03:12 | 200，无新免费额度线索 |
| nodeloc | `nodeloc.com/c/internet/5` | html | 03:12 | 200，无入库候选 |
| codebuddy 定价 | `codebuddy.cn/pricing` | 渲染代理 | 03:14 | 200，条款可读，发现「单应用资源点限免 10,000」 |
| vyce | `vyce.cloud` | 渲染代理 | 03:14 | 200，套餐与地域可读 |
| qoder activities | `qoder.com/activities` | 渲染代理 | 03:14 | 200，300 Credits + 2 周试用仍在 |
| lingma 定价 | `lingma.aliyun.com/pricing` | 渲染代理 | 03:14 | 200，**页面已改由 Qoder CN 定价体系承载** |
| hetzner 实验页 | `docs.hetzner.com/.../experiments/inference/` | 渲染代理 | 03:14 | 200，免费与限速表可读 |
| kaggle GPU 文档 | `kaggle.com/docs/efficient-gpu-usage` | 渲染代理 | 03:15 | 200，每周 30 小时可读 |
| groq 限速 | `console.groq.com/docs/rate-limits` | 渲染代理 | 03:15 | 200，免费档表逐项一致 |
| tinybird / zilliz / aiven / qdrant / crewai / ai21 / zep 等 60+ 官方页 | 各条 `officialUrl` | curl 直读 | 03:12 | 全部 200 |
| CodeArts 开通页 | `developer.huaweicloud.com/codeartsco.html` | 渲染代理 | 03:15 | 200，个人体验版条款可读（新增来源） |
| Comate 价格页 | `comate.baidu.com/zh/pricing` | 渲染代理 | 03:15 | 200，Free 档条款可读（新增来源） |
| ModelScope 限额文档 | `modelscope.cn/docs/model-service/API-Inference/limits` | html + 渲染代理 | 03:15 | 只有标题与导航，正文客户端渲染 → 记 restricted |

- 直接网络读取：87 个 URL（84 条到期记录的 `officialUrl` + 近两条 `evidence`），**全部 HTTP 200**，无一失败；其中 8 条正文为 SPA 壳，改用 `r.jina.ai` 渲染代理取全文（codebuddy / vyce / qoder / lingma / kaggle / hetzner / groq / Comate）。
- 未读取：本轮窗口外的存量官方页按规则不重复抓取，只处理到期队列。

## 候选

新发现 5 / 去重后 3 / 入库 3 / 排除 2。

| 候选 | 原始线索 | 官方候选 | fingerprint / 结论 |
| --- | --- | --- | --- |
| 华为云码道 CodeArts 个人体验版 | tokenpencil 免费清单 | `developer.huaweicloud.com/codeartsco.html` | 官方开通页可证 → **active/high** |
| 百度 Comate 个人标准版 Free | tokenpencil 免费清单 | `comate.baidu.com/zh/pricing` | 官方价格页可证 → **active/high** |
| 魔搭 ModelScope 每日 2,000 次 | tokenpencil 免费清单 | `modelscope.cn/docs/.../API-Inference/limits` | 官方限额页不可读 → **pending/low**，`lastVerifiedAt=null`、evidence 为空 |
| 美团 CatPaw 长期免费 | tokenpencil | `catpaw.meituan.com` / `meituancatpaw.com` | 落地页只有产品矩阵，无免费额度条文 → 排除 |
| 云知声 U Plan Free 档 | tokenpencil + 官网横幅 | `maas.unisound.com` | 首页仅「Free 档免费领」一句，额度/资格无条文 → 排除，留待下轮 |

- 排除的聚合站候选（perq）：Cerebras $5、Vapi $5、SiliconFlow $1、Browser Use $1、Stability 25 credits、Snowflake $400（企业/期限条款不足）、Hyperbrowser 5,000 credits、ScraperAPI 5,000 credits/7 天、Railway $5/30 天、Baseten（未披露面值）——面值 <$10 或已在既有结论中排除。
- 排除的 usefree 候选：HashiCorp 学生 $500（指向 GitHub Student Pack 聚合页，非官方独立条款）、Replit $20、Higgsfield $15、Krea 100 units、Ideogram / Meshy / JetBrains / MiniMax 等小额 UI 积分。

## 存量

- 有效（displayStatus=active）**111 条**；满 24 小时或更早到期进入队列 **84 条**（active 69 / pending 14 / upcoming 1）。
- 复核成功 **84** / 失败 **0** / 未处理 **0**。
- 逐条对照结果：**83 条条款零变化**，仅刷新 `lastVerifiedAt`/`nextReviewAt` 并追加 evidence + history；**1 条实质变化**（通义灵码）。
- 本轮队列的时间分布：69 条 active 全部来自 2026-11-07T02:39:15Z 那一批（间隔 24.6h），14 条 pending 与 1 条 upcoming（nuyek）nextReviewAt 早在 11-08T02:39Z 到期。
- 未提前重核：11-07 之后各轮已刷新的 27 条 active 未再次抓取，按规则只处理到期者。

### 实质变化与修正

1. `tongyi-lingma-free-personal-202611`：`lingma.aliyun.com/pricing` 页面标题已变为「Qoder - AI 智能编程助手」，脚注写明「体验版、专业版、高级版、旗舰版和团队版现已支持 Qoder CN 全系列产品」。免费档由「个人基础版 ¥0 + 对话 50 轮次/月、单测 50 方法/月」改为「体验版 ¥0：有限的体验额度 + 为期 2 周的专业版试用及 300 Credits + 签到 30 天累计 3,000 Credits」，原量化数值已下线。因关键额度不再明确，**状态 active → pending、confidence high → medium**，标题与 quota/validity/deadlineNote 已同步。
2. `codebuddy-cn-free-500-credits-2026`：定价表新增「单应用云服务资源点 5,000（限免 10,000）」，quota 已补注限免值；其余条款不变。

## 证据（逐条）

- 每条到期记录均追加一条 `evidence`，`url` 取该条 `officialUrl`，`summary` 写明本轮实际读到的条款或「逐项对照未发现变化」及正文体量；`checkedAt` = 本轮 UTC 时间。
- 需渲染代理的 8 条在 summary 中注明读取方式；Render 的「512 MB 内存」本轮未在免费文档页复现，已在 summary 中标注该点未复现，保留原记录数值。
- 华为云 Flexus L 的活动规则仍为 JS 弹窗/登录态渲染，期限与续费条文本轮不可读，evidence 注明「沿用上次结论」。

## 检查

- `npm run validate:data` → 通过：**148 条正式资源，123 个来源定义**。
- `npm test` → **30 / 30 通过**。
- `npm run build` → 通过，`dist/assets/index-DejNWPQA.js` 1,227.97 kB / gzip 331.30 kB。
- 未做浏览器视觉复查（本轮无 UI 变更）；未运行 `npm run check` 合并命令，等价命令已分别执行。

## 交付

- 修改：`data/resources.json`（84 条复核 + 3 条新增）、`.agents/skills/resource-research/references/sources.json`（+3 来源、-0，共 123；刷新 23 条来源观测）。
- 新增报告：本文件（`docs/` 被全局 gitignore 忽略，需 `git add -f`）。
- 提交与推送：见文末「发布」段落。

## 发布

- 提交：`6524abc`（`data/resources.json` + `sources.json` + 本报告），直接推送 `main`（`944e3d0..6524abc`），未强推、未绕过分支保护。
- Pages run：<https://github.com/SomiW/freestack-radar/actions/runs/42442214804> — **success**。
- Check（CI）run：<https://github.com/SomiW/freestack-radar/actions/runs/42442214823> — **success**。
- 线上抽检：`https://somiw.github.io/freestack-radar/` 返回 200，引用 `assets/index-DejNWPQA.js`；下载该文件 1,227,977 B，SHA-256 `43451bc8…` 与本地 `dist/` 完全一致；三条新 id `huawei-codearts-agent-personal-free-202611`、`baidu-comate-free-personal-202611`、`modelscope-daily-free-api-quota-202611` 在线上 bundle 中各命中 1 次。
- 阻碍与后续待办：
  - 通义灵码（Qoder CN）免费额度已不量化，需人工在客户端核对体验版实际可用量后再决定回 active 还是维持 pending。
  - 魔搭 ModelScope 限额页客户端渲染，需人工浏览器读取后决定升 active 或归档。
  - 长期人工项不变：Muse、GreenCloud 续费价、华为券上限、云智手机、Memoh、HKCloudX、GPU Flow、Munito、Flonno、Gemini 逐模型、腾讯云 38 元新客、AMD、Anyscale、Gladia、T Cloud、iflytek、Zep、Pinecone、阿里云学生包、v0/Dify/Portkey 绑卡、Kernel 口径、Inference.net/Nango/Kaggle/Retell/AI21 绑卡、CodeArts 积分折算与实名要求、Comate 积分有效期。
  - Nuyek 11-14 开售后复核；tencent-lighthouse（11-13）、tencent-double11（11-30）到期前须判延期或转 expired。
