# 可读来源逐源抓取手册

本手册覆盖最近登记为 readable 的 40 个来源，并保留 3 个受限和 1 个不可用来源的处理方式。
入口、状态与读取时间以 [来源登记](sources.json) 为准；本手册依据 2026-11-01 的实际读取，
本轮新增的官方核实入口已按同一次实际读取登记，没有重新联网复测其它未读来源。
示例数量是历史观察，不是未来必须返回的固定值。
不新增采集程序、后台任务或依赖；所有操作由人工或 Agent 按需执行。

## 先选择读取方式

先读目标来源的 entryUrl、methods、observation 和本表；不要把浏览器渲染型来源重新当静态 HTML 抓。

1. 有已验证 JSON/API 或 RSS/Atom 就优先使用。GitHub 读取公开目录与元数据。
2. 静态 HTML 用正常网页读取或 curl；抽取语义标题、详情和官方跳转，不猜测未验证选择器。
3. HTML 只有外壳，先查看页面明示的 preload/fetch/rel=alternate 数据链接；
   没有可直接解析的数据时，才用正常匿名浏览器渲染。不能将模板或 script 文本当已渲染列表。
4. 只有普通请求格式不兼容时换普通客户端；实际出现验证门、403/429、登录或 TLS 错误，
   停止本来源本轮请求，不通过换指纹、Cookie、代理或私有 API 绕过。

## JSON 与公开 API

正常 curl 获取原始响应，确认 HTTP 及内容类型，JSON 解析成功后再按实际数组计算条目。
下列字段是来源字段，只映射成研究候选，不直接覆盖本项目状态或证据。

| 来源 ID / 名称 | 已验证入口与读取 | 解析与成功判据 | 注意事项 |
| --- | --- | --- | --- |
| `perq` / Perq | 使用登记中的 `/api/search` 完整查询：anyone + 相关 category + newest + limit=20 | 读取 results[] 的 id、vendor、credit_value、eligibility、perq_url、source_url、claim_url；记录实际 filters、count 与数组长度 | source_url/claim_url 用于定位厂商；last_verified、status 不继承。禁用 claim/subscribe/vote 等写接口 |
| `usefree` / usefree.space | https://www.usefree.space/brands_new.json ；配套 https://www.usefree.space/freepool.json ，均由首页 preload/fetch 明示 | 遍历 items[] 品牌及嵌套 deals[]；记录 id/name/domain/website 与权益 title/summary/url/eligibility/card_required；模型池遍历 models[] | 实读 110 品牌/245 权益/281 模型，不盲信顶层 201/465；generated 只代表数据生成日，模板化说明、active/verified 均需官方核实 |
| `lowseek` / LowSeek | https://vps.lowseek.ai/data/deals.json | 解析 records[]，读取 provider、title、url、vendor_url、posted、prices、specs、locations、discount；按数组长度计数 | 本轮曾读到 81 条，数量会变。availability/confidence/score/annual_eur 都不是官方结论；价格先保存原币种和周期，不采信折算排名 |

Perq 完整默认查询已在来源登记中验证，不要退回此前 q=API&limit=3 的低覆盖窗口。
本轮默认最多新增 3 条，是去重及核实后的入库上限，不是每个源只能读前三条。

## RSS 与 Atom

优先直接下载原始 XML，不能用只支持 HTML 的网页阅读工具判断 RSS 是否失效。

| 来源 ID / 名称 | 主入口 | 抽取与范围 |
| --- | --- | --- |
| `linux-do` / LINUX DO 福利羊毛 | https://linux.do/c/welfare/36.rss | RSS item；历史实读 25 条，频道为福利羊毛。https://linux.do/latest.rss 可作有限备用，按 category 精确筛选福利羊毛，30 条窗口可能无匹配 |
| `nodeseek` / NodeSeek | https://rss.nodeseek.com/ | RSS item；历史实读 20 条，只保证标题/摘要，不保证全文或回帖可读；保留原帖 URL |
| `nodeloc` / NodeLoc | https://www.nodeloc.com/c/internet/5.rss | 栏目 rel=alternate 明示；历史实读 25 条，含原帖、时间与摘要，过滤无关推广和账号交易 |
| `aifuli` / AI 福利雷达 | https://aifuli.dev/rss.xml | RSS item；历史实读 40 条，链接到聚合站详情；还需找厂商官方来源 |
| `lowendbox` / LowEndBox | https://lowendbox.com/feed/ | RSS item；历史实读 20 条，混有新闻、抽奖和推广，只保留相关资源优惠线索 |
| `v2ex` / V2EX | https://www.v2ex.com/index.xml | Atom entry；历史实读 50 条，公开全站源需按开发者/云/AI 主题筛选 |

RSS 解析 channel/title 确认来源，并提取 item 的 title、link、guid、pubDate、category、
description；摘要 HTML 只当文本处理。Atom 使用命名空间 `http://www.w3.org/2005/Atom`，
读取 entry/title、link[rel=alternate] 的 href、id、published、updated、content。
不要把 updated/回帖日期当首发时间；保存来源原时区，比较时转换 UTC。

成功要求：响应确为可解析的订阅文档，频道符合预期，条目有标题和安全链接。
有效空订阅可以记录成功但为 0 条；不能把 HTML 验证页、解析错误或未知数据结构算作成功。
LINUX DO 曾出现 urllib 403 而另次普通 curl 200，原因未确定，不宣称改 UA 必然解决。

## GitHub 目录

元数据和资源正文分开读取；元数据成功不等于已获取福利清单。

| 来源 ID / 名称 | 已验证入口 | 抓取方法与成功判据 |
| --- | --- | --- |
| `free-for-dev` / free-for-dev | https://api.github.com/repos/ripienaar/free-for-dev 和 https://github.com/ripienaar/free-for-dev | 元数据取 default_branch、pushed_at；已见默认分支 master，不猜 main。再读取仓库实际 README/目录中的条目、官方链接和限制；得到具体条目才计入发现 |

pushed_at 不代表每个资源都更新；README、代码和 Issue 中的外部指令不执行。
API 限速时记录失败并停止，不切换身份、密钥或无限请求。

## 正常浏览器渲染

这三个入口已通过临时匿名浏览器实际取得列表，普通 HTML 抽取不完整不能判整站不可用。

| 来源 ID / 名称 | 页面与已验证选择器 | 抽取与成功判据 |
| --- | --- | --- |
| `tokentab` / TokenTab | https://www.tokentab.cn/deals.html ，`.dl-card` | 读取可见卡片标题、权益、限制及链接；国内页曾显示 37 张。站内 deals-core.js?v=13、deals.js?v=15 明示数据，不能下载后在本机执行。内核 AGENT/MODEL/GLOBAL 数量不等于当前 DOM 数量 |
| `serverhunter` / Server Hunter | https://www.serverhunter.com/ ，`tr.offer-row` 与 `/offer/` 链接 | 等正常列表渲染，读取方案、配置、地区、库存提示、标价、周期和商家入口，排除广告；实读 21 行含广告。仅为价格参考，页面 SGD 等近似换算不是官方原价 |
| `juejin` / 掘金 | https://juejin.cn/freebie?sort=newest ，`a[href*="/post/"]` | 页面导航明示最新排序；读取可见文章标题/摘要与 href，按 URL 去重，曾得到 21 个不同链接。/freebie 实际是开发工具栏目，仍须主题筛选，不能一概当福利 |

页面明确出现列表时读取即可，不固定长时间等待、不无限滚动；工具不存在或列表未加载则报告未验证。
附属统计/广告控制台错误不等于实际列表不可读；验证页或登录墙则仍按受限处理。
只读取公开 DOM，不访问账号存储、Cookie 或私有接口，不点击领取/购买/订阅按钮。
TokenTab https://tokentab.cn/feed.xml 是站点更新 RSS，曾读 28 条；
包含教程/价格库，只补充发现，不替代福利全量。它采用固定汇率折算，回官方确认原币种。

## 静态 HTML 与官方目录

以下入口已得到可用目录/文章/卡片或活动导航，不要求每站使用相同 CSS 规则。
先按语义标题与实际链接提取，只有确认 DOM 后才记录新的选择器或端点。

| 来源 ID / 名称 | 登记入口 | 如何抽取与验证 |
| --- | --- | --- |
| `aifree` / AI Free | https://aifree.dev/ | 从 Offers/新收录区域提取服务、权益与详情链接，进入详情定位官方来源；站方核实日独立保存 |
| `aispoils` / AI Spoils | https://aispoils.com/ | 读分类、静态推荐和详情链接；“正在加载”只表示该列表未提取，不否定其它已读卡片；自动模板与大面额宣传都需官网核实 |
| `token-pencil` / Token 羊毛党 | https://token.pencilai.top/ | 按免费模型/编程方案分区读标题、限额、条件及官方链接；区分当前、刚结束和付费后可用，旧卡片日期不能当当前有效 |
| `lowendtalk` / LowEndTalk Offers | https://lowendtalk.com/categories/offers | 从 Offers 主题列表提取帖子标题、原帖和提供方；必要时读公开首帖找商家入口，回复活跃时间不等于优惠起始日 |
| `freeaiapis` / freeaiapis.org | https://freeaiapis.org/ | 读公开清单与单项详情、Provider website 链接；返利/网关必须披露，站方 claimed/tested 不是本项目实领结果 |
| `github-pack` / GitHub Student Developer Pack | https://education.github.com/pack | 逐项读产品、权益、学生条件、合作方官方入口；GitHub 官方目录只证明其公布内容，合作方收费与资格仍需单独查 |
| `aws-activate` / AWS Activate | https://aws.amazon.com/startups/credits/ | 读创业赠金档位、申请资格、官方条款/FAQ 与入口；不要把最高宣传额当所有开发者能领的额度 |
| `aliyun` / 阿里云活动 | https://www.aliyun.com/benefit | 旧 /activity 已跳转此页；提取可见活动、产品、标价和详细规则链接，区分新客、续费与秒杀；页面加载受限不推断全站没活动 |
| `vpsbenchmarks` / VPSBenchmarks | https://www.vpsbenchmarks.com/ | 读评测试验、方案、测试日期与提供方入口，仅辅助配置/性能比较，不用评测日证明优惠有效 |
| `serverdeals` / ServerDeals | https://serverdeals.cc/ | 读方案卡片、CPU/RAM/磁盘/流量/地区、金额/币种/周期及商家入口；续费、税费、库存必须查商家 |
| `aideal` / AIdeal | https://www.aideal.kr/zh-CN/ | 分开读推荐、已核对和待核实区域，保存详情/原帖/官方链接；过滤身份或支付地区绕行，不继承 verified 标签 |
| `google-gemini-docs` / Google AI for Developers | https://ai.google.dev/gemini-api/docs/rate-limits ，同域 /gemini-api/docs/pricing | 必须用默认 curl UA（`-A "curl/8"`）请求；带浏览器 UA 会 302 跳 accounts.google.com OAuth 而读不到正文。定价表含 Free Tier 与 Paid Tier 多列，必须按列头逐列对齐，否则会把付费列额度误记为免费层 |
| `claude-platform-docs` / Claude Platform 文档 | https://platform.claude.com/docs/en/about-claude/api-credits-for-subscribers | 服务端渲染，正文与表格可直接提取；同目录 `.md` 后缀为纯文本孪生页（如 .../pricing.md），适合快速核对额度表 |
| `cockroachlabs-pricing` / Cockroach Labs 定价 | https://www.cockroachlabs.com/pricing/ | 首屏与 FAQ 均含试用条款与计费口径；注册入口 cockroachlabs.cloud/signup，只读条款不提交注册 |
| `northflank-pricing` / Northflank 定价 | https://northflank.com/pricing | 三档费率与 Sandbox 免费档条款在正文；页面顶部安全事件横幅必须与状态页一起读，不能只取额度数字 |
| `northflank-status` / Northflank 状态页 | https://status.northflank.com/ | Instatus 页面按时间线给出 Security incident 更新（组件数、密钥轮换开放情况、当前状态提示）；核实平台可用性时须同时记录事件与当前状态 |
| `clickhouse-pricing` / ClickHouse Cloud 定价 | https://clickhouse.com/pricing | 首页与 FAQ 均含试用条款（$300 credits / 30 天，用尽或到期即转按量付费）；Basic 与 Scale 档都标「Start free trial」，注册入口 console.clickhouse.cloud/signUp |
| `turso-pricing` / Turso 定价 | https://turso.tech/pricing | Free 档 $0/month，含 100 个数据库、5GB 存储、每月读 500 Million 行、写 10 Million 行、3GB 同步、1 天审计日志；下一档 Developer $4.99/月，逐列对齐避免把付费列额度记为免费层 |
| `boltnew-pricing` / Bolt.new 定价 | https://bolt.new/pricing | Free 档写明「Free forever, no card required」「1M tokens/month to try Bolt」，含公有与私有项目、不限数据库，并附每日用量限制 |
| `upstash-pricing` / Upstash 定价 | https://upstash.com/pricing | Free 档 $0，含 250MB 数据、10GB 月流量、500K 月命令；同页并列 Redis / Vector / QStash / Workflow / Box / Blob 的免费档上限 |
| `qoder-docs` / Qoder 文档 | https://docs.qoder.com/events/communityboost | 静态 HTML 可读，Promotion period 与 Claim window 逐条给出；同目录 `/llms.txt` 为纯文本索引页，适合快速定位活动页 |
| `memoh-docs` / Memoh 文档 | https://docs.memoh.ai/zh/guides/quick-start | VitePress 服务端渲染，正文可直接提取；快速开始只含安装与接入步骤，免费档需另找页面 |
| `meta-muse` / Muse 官网 | https://muse.ai/ | 首页只讲 Muse Secure VM 的产品定位，未出现价格、免费额度、赠金或地区限制表述；确认「官方未披露」时按未知记录，不得据此推断活动终止 |
| `tencent-dev-lighthouse` / 腾讯云开发者社区 · 腾讯轻量云官方号 | https://developer.cloud.tencent.com/user/8307438/articles | 服务端渲染（SSR HTML），只盯官方认证账号（`authorType="O"`，UID 8307438）文章列表，按 `【.*×.*】|免费领取|限时免费|0元|专属优惠|体验|成长计划` 过滤标题；文章详情页从 `<script id="__NEXT_DATA__">` 的 `articleInfo.plain` 提取完整活动规则 |
| `tencent-dev-workbuddy-tag` / 腾讯云开发者社区 · WorkBuddy 产品标签 | https://developer.cloud.tencent.com/tag/18238?entry=article | 服务端渲染（SSR HTML），提取 `section.com-article-panel-v2` 中的 `a.com-article-panel-v2-link[href]` 与 `h3.com-article-panel-v2-title`；不抓普通水文，仅筛选含 `免费|限免|0元|积分|活动|体验` 的帖子并回官方核实 |
| `aliyun-developer` / 阿里云开发者社区 | https://developer.aliyun.com/ | 不抓全站技术文章流；仅提取首屏官方活动导航、焦点轮播（含 `aliyun.com/activity/`、`platform.qianwenai.com`、`free.aliyun.com`、`edu.aliyun.com/trainingcamp`）与评测/试用入口 |
| `huaweicloud-bbs` / 华为云开发者社区论坛 | https://bbs.huaweicloud.com/ | 不抓全站论坛水帖；仅提取首屏焦点活动横幅与官方专区链接（如 `developer.huaweicloud.com/grow`、`developer.huaweicloud.com/activity/experience-officer.html`、`edu.huaweicloud.com/signup/`） |
| `volcengine-developer` / 火山引擎 Agent 开发者社区 | https://developer.volcengine.com/ | 提取首屏「AI 大模型体验中心」（`exp.volcengine.com`）与「Agent 评测集」（`/evaluation-set`）等官方体验入口；`/articles` 博客流仅按官方活动关键词过滤 |

成功要求是取得可用发现条目或公开活动导航，且能区分标题、内容和链接；
仅站名、菜单、加载占位、广告模板或访问确认页面不算列表成功。
没有统一更新时间时记未知，不从页脚年份推断活动时间。

## SPA 外壳与只读渲染代理

以下入口直接 curl 只返回框架外壳，正文由前端异步渲染，静态读取必然拿不到条款。
此时改用只读渲染代理（`https://r.jina.ai/<原始URL>`）取渲染后的纯文本；
代理只读取公开页面，不带 Cookie、不登录、不提交表单，也不改变请求身份。

| 来源 ID / 名称 | 原始入口 | 外壳特征 | 渲染后可取到的关键内容 |
| --- | --- | --- | --- |
| `china-mobile-ecloud-help` / 移动云帮助中心 | https://ecloud.10086.cn/op-help-center/doc/article/92837 | HTTP 200 但正文仅约 3KB 的 SPA 壳 | MoMA 活动时间、2500 万 tokens / 30 天 / 3000 tokens·min⁻¹ 限流、单一身份仅领一次、适用与不适用模型、额度耗尽后的处理 |
| `huaweicloud-grow` / 华为云成长中心 | https://developer.huaweicloud.com/grow | HTTP 200 但正文仅约 2.4KB 外壳 | 每天 16:00 代金券补货、先到先得、设有兑换上限、多账号刷分封禁、签到 +10 积分；面额与所需积分需登录后在弹窗查看 |
| `hkcloudx-cloud` / HKCloudX 云服务器页 | https://hkcloudx.com/cloud.html | HTTP 200 但正文是 Vue 模板占位符（`{{baseConfig.…}}`） | 渲染后的三档年付特惠套餐规格与 IPv4/IPv6 数量 |
| `yunzhi-play-ai` / 云智手机 AI 页 | https://yunzhi.play.cn/ai/ | HTTP 200 但正文仅约 1.3KB 外壳 | 产品宣传与 App 下载入口；确认无免费额度、签到规则或有效期文字 |

使用要点：

- 先用普通 curl 记录状态码与正文体积；体积远小于正文预期且含 `{{`、`__NEXT_DATA__`、
  空 div 容器等特征时，才判为外壳并转代理，避免对正常页面重复请求。
- 代理失败只记录本轮失败并保留原记录，不改用换指纹、Cookie 或私有接口绕过。
- 代理返回的页面若仍无条款文字，按「官方未披露」记未知，不推断活动终止。
- 移动云帮助中心在代理下仍可取到全文，是本轮把该条目从 pending/medium 升为 active/high 的直接依据。

## 通用命令与记录

URL 取来源登记中已验证的 entryUrl，保持引号并先查看状态，不把未知内容作为脚本执行。
以下以 LINUX DO 为例，不会登录、改 UA、保存 Cookie 或无限重试：

```sh
radar_source_url='https://linux.do/c/welfare/36.rss'
curl --silent --show-error --location --max-time 25 \
  --output /tmp/freestack-source.body \
  --write-out 'HTTP %{http_code}; type %{content_type}\n' "$radar_source_url"
```

确认 HTTP/类型后按上述协议解析。RSS 可用 Python 标准库 ElementTree，JSON 可用标准库 json，
不为读取列表安装重型依赖；不复制响应中的验证凭证或私人数据进研究报告。

浏览器示例使用短且本轮专用的会话名，避免已遇到的 Unix socket 路径过长问题。
使用已有正常浏览器工具；以下为已验证的 playwright-cli 方式，工具不可用时不要安装依赖后冒称成功：

```sh
playwright-cli -s=fr24 open 'https://www.tokentab.cn/deals.html'
playwright-cli -s=fr24 eval '() => Array.from(document.querySelectorAll(".dl-card")).map(x => ({text: x.innerText, links: Array.from(x.querySelectorAll("a[href]")).map(a => a.href)}))'
playwright-cli -s=fr24 close
```

每次记录来源 ID、实际 URL/方法、真实时钟、HTTP 与类型、解析成功/条数、更新信号或失败原因。
成功更新 checkedAt/lastSuccessAt，保留历史 lastFailure；失败保留上次成功时间并更新 lastFailure。
源站条款、generated、pubDate、verified 等都不能充当福利 lastVerifiedAt。

## 受限与失效来源

本轮没有新方法时保留失败，来源失败不改变福利状态，也不阻断其它来源。

| 来源 ID / 名称 | 最近问题 | 处理方式 |
| --- | --- | --- |
| `tencent-cloud` / 腾讯云优惠全站搜 | 200 但只有 EO_Bot_Ssid 验证脚本，无商品列表 | 当前路径受限；另次任务可从官方公开导航验证具体活动页或人工正常查看，不伪造验证 Cookie |
| `xianbao` / 线报酷 | 200 但为访问确认页，需环境/通行凭证验证 | 停止本来源请求，等待公开 RSS 或人工正常查看，不执行验证逻辑或借代理绕过 |
| `zuanke` / 赚客大家谈 | 普通 curl 证书错误；网页读取 502；Firecrawl basic 保持 TLS 验证仍 SSL 错误 | 需站方修复证书链或提供有效 HTTPS 入口；不关闭验证、不降级 HTTP |
| `free-llm-api` / cheahjs/free-llm-api-resources | 原仓库网页/API 404 | 保留原定义，不默认为删除/永久失效；不自动用同名 fork 替换；专项复核时才检查恢复 |

只有普通访问完全不可用时才考虑授权的 Firecrawl，保持 basic、TLS 验证和正常权限；
不启用付费资源、stealth/enhanced 或反复重试。工具层 DNS/格式/本机会话错误单独说明，
不要将其伪装成源站 HTTP 拒绝；HTTP 200 的验证壳也不能标成功。
