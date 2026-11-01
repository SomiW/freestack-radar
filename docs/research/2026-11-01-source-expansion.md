# 福利情报来源扩展与实测记录

执行时间：2026-11-01T03:09:00Z（UTC）；北京时间 2026-11-01。

本次为来源能力维护，不是福利采集运行。不新增福利、不复核活动、不刷新正式数据。
28 个独立来源定义覆盖本次 23 个候选和其余 5 个旧来源；通用厂商官方入口规则继续保留。
“可读”只表示得到来源列表、摘要或结构化内容，不表示其推荐已被官方核实，也不代表采集许可或未来持续可用。

## 访问与更新证据

网页使用正常公开读取；RSS/Atom 使用 Python 标准库解析，未登录或绕过访问限制。
本地首次探测因网络权限 DNS 失败；获准联网后重新探测。网页工具不支持 XML 时改用普通 HTTP，不把工具类型限制当作网站失效。
每条来源的请求入口、检查时间及最新失败原因以来源登记 JSON 为准；下表保留本次观察。

| 来源 | 分类 / 优先级 | 结果 | 内容与更新依据 |
| --- | --- | --- | --- |
| [Perq](https://perq.sh/) | aggregator / P0 | readable | 首页、公开 API 文档与 JSON 搜索接口可读；接口 HTTP 200、application/json；站方最近核实标注 2026-10-31。 |
| [AI Free](https://aifree.dev/) | aggregator / P0 | readable | 目录与官方跳转可读；新增及站方核实日期可见 2026-10-31。 |
| [AI 羊毛 / AI Spoils](https://aispoils.com/) | aggregator / P0 | readable | 分类与详情链接可读；首页列表有动态加载，仍有静态推荐；标注更新 2026-10-31。 |
| [AI 福利雷达](https://aifuli.dev/) | aggregator / P0 | readable | RSS HTTP 200，40 条；首页标注数据更新 2026-10-30，首项 RSS pubDate 为 2026-07-08，不当作官方发布时间。 |
| [Token 羊毛党](https://token.pencilai.top/) | aggregator / P0 | readable | 静态卡片及官方链接可读；总更新时间显示加载中，卡片含 10-11/10-12 等旧时点，不能假定全部当前有效。 |
| [TokenTab](https://www.tokentab.cn/deals.html) | aggregator / P0 | restricted | 页面注明调研时点 2026-10-26；可读分类，当前文本提取未得到完整卡片。 |
| [usefree.space](https://www.usefree.space/) | aggregator / P0 | restricted | 仅提取到搜索与导航外壳，未得到福利清单或明确更新时间。 |
| [LINUX DO · 福利羊毛](https://linux.do/) | community / P0 | restricted | 历史可读订阅源本次直连 HTTP 403；网页工具不支持 RSS 类型不代表成功；本次无内容更新时间证据。 |
| [NodeSeek](https://www.nodeseek.com/) | community / P0 | readable | RSS HTTP 200，20 条，首项 pubDate 2026-11-01T03:05:28Z；只有标题和摘要，不保证全文可读。 |
| [LowEndTalk · Offers](https://lowendtalk.com/categories/offers) | community / P0 | readable | Offers 列表与商家帖子链接可读，含当日相对时间及 Halloween 活动；回复时间不等于活动起始日。 |
| [LowEndBox](https://lowendbox.com/) | aggregator / P0 | readable | RSS HTTP 200，20 条；首项 2026-10-31T11:00:56Z；同时含新闻，需过滤非优惠文章。 |
| [V2EX](https://www.v2ex.com/) | community / P0 | readable | Atom HTTP 200，50 条；首项 published 2026-11-01T02:50:17Z；全站源需按开发者主题过滤。 |
| [free-for-dev](https://github.com/ripienaar/free-for-dev) | aggregator / P1 | readable | GitHub 页面与元数据 API 可读；默认分支 master，pushed_at 2026-10-30T10:20:21Z，不代表每项福利已更新。 |
| [free-llm-api-resources](https://github.com/cheahjs/free-llm-api-resources) | aggregator / P1 | unavailable | 原仓库网页和元数据 API 均 404；无法判断删除或转私有，不自动以同名 fork 替换。 |
| [freeaiapis.org](https://freeaiapis.org/) | aggregator / P1 | readable | 清单与单项详情可读；站方测试时点可见 2026-10-23，含推荐返利和模型网关，须独立核对提供方与风险。 |
| [GitHub Student Developer Pack](https://education.github.com/pack) | official / P1 | readable | 官方学生权益目录与合作伙伴入口可读；未提取到统一更新日期；合作方资格与收费仍须逐条核实。 |
| [AWS Activate Credits](https://aws.amazon.com/startups/credits/) | official / P1 | readable | 官方创业赠金页面可读；未提取到统一更新日期，须继续核对资格和条款。 |
| [阿里云活动](https://www.aliyun.com/activity) | official / P1 | readable | 直连 HTTP 200，旧入口跳转 /benefit，标题为智享 AI · 特惠活动；未确认统一更新日期或具体可领取性。 |
| [腾讯云优惠全站搜](https://cloud.tencent.com/act/pro/searchall) | official / P1 | restricted | 热门活动及官方链接可读；结果区域显示暂无该配置在售商品，不能据此判断所有活动失效；未提取更新时间。 |
| [LowSeek 优惠雷达](https://vps.lowseek.ai/) | price-reference / P1 | readable | 公开 JSON HTTP 200，82 条；generated_at 2026-10-31T21:39:09+00:00；库存和近似汇率均仅供参考。 |
| [Server Hunter](https://www.serverhunter.com/) | price-reference / P1 | restricted | 比较筛选外壳可读，页面明确依赖 JavaScript；未读取具体搜索结果与更新日期。 |
| [VPSBenchmarks](https://www.vpsbenchmarks.com/) | price-reference / P1 | readable | 性能试验及排名可读；最近试验日期 2026-11-01，评测时点不等于优惠生效时间。 |
| [ServerDeals](https://serverdeals.cc/) | price-reference / P1 | readable | 价格配置清单及商家入口可读；标注最后更新 2026-10-29；须核实续费、库存和费用。 |
| [NodeLoc](https://www.nodeloc.com/c/internet/5) | community / P0 | restricted | HTTP 200，互联网服务栏目可读；文本主要是子分类，未得到完整最新主题及发布时间。 |
| [AIdeal](https://www.aideal.kr/zh-CN/) | aggregator / P0 | readable | 目录和官方链接可读；首页标注最后更新 10-27；保留旧来源，过滤身份或支付绕行线索。 |
| [线报酷](https://new.xianbao.fun/) | aggregator / P1 | restricted | HTTP 200 但标题为访问确认，未读到线报列表；不是采集成功，不自动通过访问确认。 |
| [赚客大家谈](https://www.zuanke8.com/) | community / P1 | restricted | 直连证书链校验失败；网页工具返回 502；未关闭 TLS 校验，未得到内容或更新时间。 |
| [掘金](https://juejin.cn/) | community / P1 | restricted | 直连 HTTP 200 标题稀土掘金，网页读取超时；未得到完整文章及可靠更新时间。 |

## 执行边界与风险

来源登记是供 Agent 按需读取的研究配置，不是后台采集器或请求许可白名单。
403、访问确认、证书错误和动态外壳均记录为受限并跳过；404 保留原定义，不推定永久停站。
本次未使用 Firecrawl：没有新增商业服务，失败已记录，后续仅完全无法正常读取时按授权决定是否使用。
未全面审核各站 ToS/robots 或实测渲染后的完整列表；下次采集仍需核对许可及限速。

## 工作区与交付

开始时 main 与 origin/main 相同：8d2996aacf63a164bc209a2e78fef3b878a2088b。
git fetch origin main 成功；本次保留原有 .claude/、.workbuddy/、live.html 未跟踪文件。
未提交、未推送、未触发 Pages；本地构建不能证明远端部署成功。

## 验证结果

- `node --import tsx --test tests/sources.test.ts`：实现前因缺少新校验模块失败；实现后 3 项通过。随后补充来源分类回归测试，最终结果见下文。
- `npm run check`：第一轮 26 项测试通过；63 条资源与 28 个来源登记通过 Schema/语义检查，TypeScript 与 Vite 构建成功。
- Vite 给出单包超过 500 kB 的警告（主包约 582 kB）；不是构建失败，本次未扩大到前端拆包。
- 正式 `data/resources.json`、资源 Schema、前端、AGENTS.md 和 GitHub Actions 均无改动；既有 pending 草案展示权限保留，阻止的是未经核实冒充 active。
- 新增测试验证不同发现来源不能绕过官方 URL 去重；现有测试继续覆盖官方证据门槛、过期状态与 24 小时 UTC 边界。
- 来源恢复与跨站最终合并由 Agent 按 Skill 执行；本次未运行带真实福利写入和远端部署的端到端采集，不能声称这些流程已在线实测。

新增或明确网址的 19 个来源：Perq、AI Free、Token 羊毛党、TokenTab、usefree.space、
LowEndTalk、LowEndBox、V2EX、free-for-dev、free-llm-api-resources、freeaiapis.org、
GitHub Student Developer Pack、AWS Activate、阿里云、腾讯云、LowSeek、Server Hunter、
VPSBenchmarks、ServerDeals。已有 AI Spoils、AI 福利雷达、LINUX DO、NodeSeek 重新验证；
NodeLoc、AIdeal、线报酷、赚客大家谈、掘金继续保留，共 28 个命名来源。

后续优先使用已实测结构化入口；受限来源留待正常恢复或授权的匿名浏览器阅读。
活动级复核、领取资格和费用仍须逐条检查，不继承任何聚合站的“已核实”标签。

最终验证：`npm run check` 再次通过（新增分类用例后共 27 项测试，63 条资源、28 个来源，类型检查与 Vite 构建成功）；`git diff --check` 通过，Skill 本地 Markdown 引用全部存在。
来源统计：18 可读 / 9 受限 / 1 当前不可用；13 聚合 / 7 社区 / 4 官方 / 4 价格参考。
研究报告被用户全局 Git ignore 的 docs 规则忽略，已仅对本报告执行 `git add --intent-to-add -f`，使其出现在可审阅差异中；未暂存正文、未提交或推送。

相关修改：两份 SKILL.md、原 sources.md、研究 references/sources.json 与 discovery.md、
automation/research-prompt.md、schema/sources.schema.json、scripts/source-registry.ts、
scripts/validate.ts、tests/sources.test.ts、tests/resources.test.ts，以及本报告。
内部 30/30/20/20 权重仅用于研究队列，页面排序和资源 JSON 结构保持不变。

## 后续排查：LINUX DO RSS（北京时间 2026-11-01 17:58–17:59）

应用户要求检查其他读取方法；本次正常 curl 匿名直连已成功，无代理、Cookie、登录、
Firecrawl 或 Cloudflare 绕过。前文 18/9/1 为首次快照，恢复后为 19 可读 / 8 受限 / 1 当前不可用。

| 入口 | 读取方式 | 实际结果 |
| --- | --- | --- |
| https://linux.do/c/welfare/36.rss | curl 默认设置 + 标准库 XML 解析 | HTTP 200，application/rss+xml；25 条，频道标题“福利羊毛 - LINUX DO”，条目分类均为福利羊毛；最近一条 pubDate 2026-11-01T09:00:14Z |
| https://linux.do/latest.rss | curl 默认设置 + 标准库 XML 解析 | HTTP 200，application/rss+xml；30 条；最近一条 pubDate 2026-11-01T09:57:31Z；本次列表没有福利羊毛条目，备用覆盖有限 |
| 上述两个入口及资源荟萃 RSS | 网页读取工具 | Unsupported content-type: application/rss+xml，仅证明工具格式不兼容，不能宣称 XML 已解析 |

福利 RSS 成功读取时间：2026-11-01T09:58:18Z。来源登记改为 readable，保留 03:06 UTC 的 urllib 403 失败记录。
原 Python 请求与 curl 的客户端、时点均不同，尚未确定是临时恢复还是客户端差异，
不声称修改 UA 必然有效。未复测资源荟萃原始 XML，不把它登记成已可用备用。

本次未新增福利、未刷新官方核实时间、未提交或推送。

本次 RSS 修订后验证：`npm run check` 通过（27 项测试、当前 66 条正式资源和 28 个来源登记、TypeScript 与 Vite 构建）；`git diff --check` 通过。仍有既有包体大小警告。

## Review 后修复

- 来源测试不再固定总数或任何真实站点的在线状态，保留全部 28 个必要来源的存在性检查；允许继续增加来源。失败、恢复与历史保留通过固定时钟的合成来源验证。
- 来源 URL 与 entryUrl 均使用 URL 解析器检查 HTTPS 和主机名；非法输入返回校验错误，不再抛出未处理异常。补充合法 RSS、API 查询参数和独立订阅域名用例。
- 发布 Skill 明确：本轮新标 active 或成功复核才要求新读取证据；未到期且无变化的存量 active 沿用可信记录，已到期项仍安排复核。pending 草案交付权限保留。
- 回归测试先复现 Invalid URL 异常失败，修复后通过；最终 npm run check 全部 30 项测试通过，66 条正式资源与 28 个来源校验通过，TypeScript 和 Vite 构建通过。仍有既有 500 kB 包体警告。
- 本轮未修改正式资源或 Actions，未提交、未推送、未部署。
