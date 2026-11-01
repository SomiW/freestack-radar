# 8 个受限来源的读取复核

本轮按用户要求复核来源可读性，不是福利活动采集运行。
未新增福利或刷新活动核实时间；未提交、未推送、未触发 Pages。
开始时间 2026-11-01T10:28:34Z（北京时间 18:28:34），最终可用性判定时钟为
2026-11-01T10:34:08Z（北京时间 18:34:08）。

## 方法与范围

复核原登记为 restricted 的全部 8 个来源：TokenTab、usefree、腾讯云优惠全站搜、
Server Hunter、NodeLoc、线报酷、赚客大家谈和掘金。
原始 HTML 使用正常 curl 直连，数据链接只从页面明确引用的 script、preload、fetch、
rel=alternate 或导航发现，不猜测私有 API。
公开页面若只缺正常 JavaScript 渲染，则用临时匿名浏览器读取公开 DOM。
出现验证门或证书错误时不注入 Cookie、不关闭 TLS 校验、不使用绕过或隐身模式。
临时响应与浏览器快照留在 /tmp，未向仓库复制包含 IP、验证脚本或 Cookie 的原始页面。

## 结果与读取方案

原 8 个受限来源中，5 个找到正常读取方式，3 个仍受限。
来源登记总体从 19 可读 / 8 受限 / 1 当前不可用变为 24 / 3 / 1；
其余来源本轮未复测，该汇总只表示最近登记状态。

| 来源 | 实际证据 | 方案与结论 |
| --- | --- | --- |
| TokenTab | 原页 200，明确引用 deals-core.js?v=13、deals.js?v=15；正常浏览器 DOM 有 37 张国内卡片；内核 AGENT 20、MODEL 17、GLOBAL 15，UPDATED 2026-10-30 | 保留福利页为主入口，正常浏览器渲染后读卡片；站点 RSS 可补充发现，不代替卡片全量；恢复 readable |
| usefree | 页面明确 preload/fetch brands_new.json、freepool.json；均 200 且成功解析 | 主入口改为 https://www.usefree.space/brands_new.json ，模型池 https://www.usefree.space/freepool.json 作补充；恢复 readable |
| NodeLoc | 栏目 rel=alternate 明确提供 https://www.nodeloc.com/c/internet/5.rss ；200，25 条，含标题、原帖与日期 | 改用分类 RSS 为主入口，恢复 readable |
| Server Hunter | 原 HTML 是筛选/模板外壳；正常浏览器渲染后有 21 个 tr.offer-row、22 个 /offer/ 链接，含广告 | HTML 方法注明需要正常匿名浏览器；仍为价格参考，不能核定活动有效；恢复 readable |
| 掘金 | 正常匿名浏览器 /freebie 有 20 个不同文章链接；导航明确提供最新排序，https://juejin.cn/freebie?sort=newest 有 21 个不同文章链接 | 主入口改为该最新排序页面；实际栏目名是“开发工具”，不将所有文章当福利；恢复 readable |
| 腾讯云优惠全站搜 | curl 200，但仅约 985 字节 EO_Bot_Ssid 浏览器验证脚本，无商品列表 | 保留 restricted；不执行验证逻辑、不伪造 Cookie。可另次由用户正常人工查看或从官方导航重新验证具体活动页 |
| 线报酷 | curl 200，但标题为访问确认，页面明确要求环境/通行凭证检查，无线报列表 | 保留 restricted；本轮停止本来源请求。需站方公开 RSS/列表或正常人工查看，不用代理绕过 |
| 赚客大家谈 | curl 错误 60（证书链校验失败）；网页读取 502；完全不能正常访问后，Firecrawl basic + skipTlsVerification=false 仍返回 SCRAPE_SSL_ERROR | 保留 restricted；需站方修复证书或提供可验证 HTTPS 入口。不关闭证书验证、不添加不可信根证书、不降级 HTTP |

## 结构化入口实测细节

这些入口均来自页面明确发布的链接，未根据框架猜测。

- TokenTab 两个站内 JS 均 200。仅静态检查其声明，并让站点在正常浏览器中加载；
  未在本机执行下载的第三方脚本。
- https://tokentab.cn/feed.xml 为 200、28 条站点更新，包含教程/价格库等非福利内容；
  最新首项时间为 2026-10-29T09:00:00+08:00，不是官方福利生效时间。
- usefree brands_new.json 的 generated 为 2026-10-26T12:00:00+00:00，
  实际 items 110 个品牌、嵌套 deals 245 条；顶层声明 brands=201、deals=465，不能采信为实际返回数量。
- usefree freepool.json 实际 models 281 条，generated 为 2026-10-22T12:00:00Z。
  其中条目自带的 active/verified 和模板化领取说明都只作线索，不自动转成本项目官方结论。
- NodeLoc 分类 RSS 的最新首项 pubDate 为 2026-11-01T10:25:25Z。
  仍需过滤账号交易、绕行、推广和无关内容。
- Server Hunter 价格有近似换算标记，当前页面显示 SGD；TokenTab 也有固定汇率换算。
  后续活动必须从商家/厂商官网核对原币种、周期、续费与库存，不能复制参考站金额作为官方价格。

## 工具问题与边界

浏览器 CLI 首次因会话名过长导致本机 Unix socket 启动失败，改用短会话名 fsr 后成功。
这是本机工具问题，不登记为来源失败；未安装新依赖或修改系统配置。
Server Hunter、掘金有附属请求控制台报错，但已取得实际列表，不能仅据错误数量判整站失效。
本轮临时匿名浏览器已关闭，未操作账号、购买、领取或支付。

Firecrawl 仅对普通访问和网页读取都失败的赚客大家谈尝试一次；
使用 basic、保持 TLS 验证、无 stealth/enhanced。其建议关闭验证的错误提示没有执行。
未启用新商业服务或付费基础设施；这是已有连接器的一次失败读取，不宣称零额度消耗。

## 落盘与验证

更新来源登记中这 8 条的状态、入口、方法及检查结果；5 条恢复来源保留此前失败历史，
3 条受限来源记录本次失败。新增研究参考 access-paths.md，并从 discovery.md 链接，
便于后续 Agent 按已验证方法操作，不反复将 HTML 外壳误判为整站不可读。

`npm run check` 通过：30 项测试、69 条正式资源与 28 个来源 Schema/语义检查、
TypeScript 和 Vite 构建全部成功。既有超过 500 kB 的包体警告仍在。
`git diff --check` 通过，本地文档引用全部存在；本轮正式福利 JSON 的 Git blob 保持 f4ace5e94298b837225a7a6f2b07fb93659d33e2，未修改任何福利条目。
