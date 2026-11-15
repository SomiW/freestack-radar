# 2026-11-16 00:47 CST（UTC 2026-11-15T16:47Z）全量 24h 复核 + 增量发现轮

- **任务范围**：按需运行一轮「存量全量复核 + 官方核实新候选 + 增量写入 + 构建校验 + Pages 交付」，不含定时采集器。
- **UTC 时钟**：开始 2026-11-15T16:47:57Z；数据写入 2026-11-15T16:51:44Z。
- **环境**：macOS 本机，`curl deno.com` 200、`api.github.com` 200、`git ls-remote` 正常（上轮 TLS 全拦未复现）。
- **源 SHA**：基线 `7534171`（本地与 `origin/main` 一致，无积压）。

## 来源

选取 12 / 成功 11 / 失败 1 / 未读取 0

| 来源 | URL | 方法 | 时间(UTC) | 结果 |
| --- | --- | --- | --- | --- |
| 50 条到期 active 官方页 | 见下表 | curl 直连 | 16:47–16:50 | 49/50 HTTP 200；val-town 403→渲染代理补读 |
| perq | `https://perq.sh/api/search?type=free-tier&sort=newest&limit=50` + `signup-credit` | JSON | 16:48 | 各 50 条（66 KB/62 KB），`last_verified` 均为 2026-11-15 |
| linux-do | `https://linux.do/c/welfare/36.rss` | RSS | 16:48 | 25 条（75 KB） |
| nodeseek | `https://rss.nodeseek.com/` | RSS | 16:48 | 20 条 |
| aifuli | `https://aifuli.dev/rss.xml` | RSS | 16:48 | 40 条 |
| token-pencil | `https://token.pencilai.top/` | 直连 TLS 失败 → `r.jina.ai` | 16:48 | 渲染 152 KB，79 项免费方案 |
| autoclaw 官方博客 | `M11W2` / `M11W3` | curl | 16:49 | 两期公告均读到正文 |
| coderabbit 公开指标 feed | `storage.googleapis.com/coderabbit-public-metrics/v1/oss/latest.json` | JSON | 16:50 | `generated_at` 2026-11-15T12:33Z |
| together 模型页 | `https://www.together.ai/models/prism-ml-ternary-bonsai-27b` | curl | 16:52 | 200，46 万字节 |
| valyu 定价页 | `https://www.valyu.ai/pricing` | curl | 16:52 | 200 |
| lightvela（社区帖指向） | `https://lightvela.com/` | curl | 16:53 | 200，无法确认官方归属 → 排除 |
| dartnode | `https://dartnode.com/open-source` | curl | 16:53 | **失败**：Cloudflare Security Check（403） |

## 候选

新发现 8 / 去重后合格 3 / 排除 4 / 入库 3

- 入库（active/high）：
  - `autoclaw-weekly-100m-tokens-202611`（新一期，`https://autoclaw.zhipuai.cn/blog/news/M11W3/`，100M Tokens = 10,000 积分，11-16 00:00—11-22 23:59 北京时间，每人一次，同期失效）
  - `together-ternary-bonsai-27b-free-202611`（`https://www.together.ai/models/prism-ml-ternary-bonsai-27b`，输入/输出均 $0/1M tokens、262K 上下文）
  - `valyu-free-2000-search-credits-month-202611`（`https://www.valyu.ai/pricing`，工作邮箱 2,000 credits/月；个人邮箱 1,000 起、月度需绑卡）
- 去重命中：Rime、Inception、Blacksmith、Hatchet、Keenable、NeevCloud、Z-ai、NVIDIA、Kiro、Devin/Windsurf 等已在库。
- 排除：
  - **Maritaca S5-free**（`docs.maritaca.ai/en/precos` 与 `rate-limits` 均读到「S5-free free of charge for a limited time、tokens are not billed、text only、60 RPM/256k TPM」）；条款充分但平台以巴西葡语为主、注册是否需 CPF 与地区可用性未知，本轮新增额度已满 3 条，**留候选下轮评估**。
  - **Blaxel「up to $200」**：条件仍未披露（第 2 轮）。
  - **lightvela.com（社区称「腾讯版 Muse」）**：域名与腾讯无关联，无法确认官方归属。
  - **华为云 5 个月新加坡 VPS**：linux.do 帖内无官方链接，未取得官方活动页。
  - **腾讯 CodeBuddy 500 积分/月、Google AI Pro 3 个月试用**：前者与库内腾讯系条目重复，后者需绑卡且为留档帖。

## 存量

有效 159 / 满 24 小时到期 50（active）+ 18（pending/upcoming）→ 复核成功 61 / 失败 7 / 未处理 0；终结态积压 9 未重核（nextReviewAt 过期，按旧口径不计入本轮）。

- active 50 条：全部成功刷新 `lastVerifiedAt` 与 `nextReviewAt(+24h)`，追加 evidence/history。数值覆盖率（单位归一化）41 条 1.00，9 条偏低全部为已知的渲染或缺项，逐条人工确认无条款变化（详见下表说明）。
- pending/upcoming 18 条：成功 11（含 nuyek 升为 active/high）、失败 7（dartnode、memoh、hkcloudx、meta-muse、inkstone、yunzhi、modelscope）保留原记录并计为积压。

## 证据与状态变化

### 条款/状态变化（3）

1. **AutoClaw 本期结束 + 新一期**：`autoclaw-double11-50m-tokens-202611` 已过 2026-11-15 23:59（北京）= 15:59Z 且官方无延期 → 持久化 **expired**；新一期 `M11W3` 另立条目 active/high（100M Tokens，=10,000 积分，每人一次，11-22 23:59 失效）。
2. **coderabbit 统计口径调整（非免费政策变化）**：页面由「已计 $2,250,000 / 1,298,000 OSS PR」改为「$10.0M committed / **$1.2M+ in cash delivered to maintainers, all time** / 2.3M+ PR since Mar 2026」，近 30 天 520,612（上轮 515,250）；新增官方 JSON feed 作为可核验来源：distinct PR **2,368,040**、rolling 30 天 **520,612**、累计覆盖成本 **$7,205,312.85**。quota 与 evidence 已按新口径改写。
3. **nuyek 由 upcoming 升为 active/high**：官方首页由「Starting November 14」转为「BLACK FRIDAY SALE — LIVE NOW」，VPS 档 $11.00/yr（1 vCore/2GB/25GB NVMe/100 Mbps/8TB）配「15 at Launch, Then 1 Daily Until January 1st, 2027」与商品卡 `BF2026-VM1`；独服 $15/mo 限 20 台未变。未知：单台库存、续费价、机房位置。

### 复核无变化（58 条要点）

- val-town：直连 403，渲染代理可读，Free $0 / 100,000 runs·天 / 关停公告 2027-01-10 均在。
- baidu-comate：渲染后 Free 5,000 积分、Auto-Free 150k tokens/h、Pro ￥59 / Max ￥199 未变。
- munito：本轮 Free 档限速表完整渲染（2,000,000×3 + 4,000,000/天、256,000 上下文）。
- ovh：Anonymous 2 rpm、API key 400 rpm 原文仍在。
- openrouter：`free_model_daily_requests` 字段说明在，数字仍客户端渲染 → 按渲染退化处理。
- speechmatics（$100 / no card / $0.12–0.38 per hr）、turso（5GB / 500M read / 10M write）、bolt（1M/月、300K/天、333k 请求）、exaone（「free of charge」changelog 未变）、aliyun 云工开物（300 元 / 5 折 / 40 万上限 / 活动至 2027-03-31）、akashml、braintrust、dify、parallel、livekit、posthog 等 43 条：关键数值与档位一致。
- huawei 成长中心（渲染后读到 11-23 新平台/11-20 停服兑换公告）、iflytek 星辰（10 亿 tokens 横幅 + 倒计时约 5 天）、pinecone、civo、northflank、airtop、t-cloud、cursor、sambanova、aliyun 学生算力包：与库内一致。

## 检查

| 命令 | 结果 |
| --- | --- |
| `npm run validate:data` | 通过：201 条正式资源 / 176 个来源定义 |
| `npm run build` | 通过：`dist/assets/index-Dnxc61PM.js` 1,934.08 kB（gzip 467.84 kB） |
| `npm run check`（npm test 30 项） | 未运行：本轮无代码/校验逻辑变更，完整 check 由独立 CI 执行 |

未执行项：未注册/未登录任何服务、未实领额度；未对 9 条终结态（expired/unavailable）重核。

## 交付

- 文件差异：`data/resources.json`（50 条复核 + 1 条 expired + 3 条新增 + 1 条升档）、`.agents/skills/resource-research/references/sources.json`（刷新 perq / linux-do / nodeseek / aifuli / token-pencil / autoclaw-blog，新增 valyu-pricing、together-models）、本报告。
- 提交与推送：见本轮提交记录（直推 main，未强推、未跳过分支保护）。

## 发布

- 触发方式：main 推送后由 `.github/workflows/pages.yml` 构建部署；结果与线上抽检见提交后的补记。

## 待办

- Maritaca S5-free（地区/CPF 门槛）与 Blaxel（up-to 条件）下轮评估；华为云新加坡 VPS 5 个月需找官方活动页。
- 上轮遗留：antigravity 11-18 移除 Claude 4.6 / GPT-OSS-120B 须复查；iteracompute 11-24、qiniu 11-30、heygen 11-30、fireworks 11-30、kiro 12-01、腾讯双11 11-30 到期前复核；AutoClaw 每周福利下期（11-23 起）按官方新公告处理。
- 长期积压：dartnode(21)、modelscope(7)、yunzhi(11)、inkstone、memoh、meta-muse、hkcloudx 归档口径；qoder 300 Credits（pending/medium）继续保留。
