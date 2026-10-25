# 2026-10-26 资源采集运行记录

- 开始时间（UTC）：2026-10-25T16:21:00.015Z；北京时间 2026-10-26 00:21:00。
- 数据记录时间（UTC）：2026-10-25T16:23:24.401Z。
- 执行方式：本次按用户请求手动执行的远端仓库维护；未新增定时任务或采集器。
- 基线 main：ff7e0bba9879b4461188289769d11148140456e7。
- 依据：本次从基线重新读取两个 Skill、AGENTS、核心目标、MVP 范围、架构、Schema、正式数据、status.ts 和 Pages 工作流。

## 存量扫描

先执行 npm run validate:data，3 条原始资源通过 Schema/语义校验。使用 src/status.ts 的 displayStatus/dueActiveResources 和本次开始 UTC 时间扫描全部数据。

- 当前有效 2 条：vyce-vps-mini-free-2026、render-free-web-service-2026。
- 两条 lastVerifiedAt 均为 2026-10-25T15:59:12Z，距本次开始约 0.363 小时。
- 满 24 小时：0；复核成功 0；失败 0；未处理到期项 0。
- 原 pending：InstaBox 1 条。本轮不重复刷新其核实时间。
- 存量内容、证据和历史保持原样；归档 0、额度/状态变更 0。

## 来源覆盖

发现源页面读取成功 8 / 失败 1。成功仅指公开页面可读取，不表示条目已有效或已经验证 RSS/API、robots、ToS 及自动采集许可。未创建或启用任何来源采集配置。

| 来源 | 实际公开入口 | 本轮结果 |
| --- | --- | --- |
| LINUX DO 福利羊毛 | https://linux.do/c/welfare/36 | 读取栏目及两条原帖，选入 Qoder、LightVela |
| NodeSeek 情报 | https://www.nodeseek.com/categories/info | 读取相关栏目；未新增入库 |
| NodeLoc 互联网服务 | https://www.nodeloc.com/c/internet/5 | 读取栏目；未新增入库 |
| AI Spoils 沙箱专题 | https://aispoils.com/type/dev.html | 读取专题，选入 E2B；聚合配置不直接采信 |
| AIdeal | https://www.aideal.kr/zh-CN/ | 读取公开列表；未新增入库 |
| 线报酷 | https://new.xianbao.fun/ | 读取公开列表；未新增入库 |
| AI 福利雷达 | https://aifuli.dev/a/developer/ | 读取开发者分类；未新增入库 |
| 赚客大家谈 | https://www.zuanke8.com/ | 普通读取超时；未登录、未绕过、未重试采集 |
| 掘金 | https://juejin.cn/post/7699033523931873306 | 读取 Qoder 旧限免报道，发现截止说法过时，未直接采信 |

## 新线索及官方证据

新增 3 条（达到本次上限），全部 pending；官方完整核实成功 0，部分佐证 2（LightVela 产品归属、E2B 额度），Qoder 活动正文未读取到。

| 条目 | 来源 / 官方入口 | 结果与差异 |
| --- | --- | --- |
| Qoder | https://linux.do/t/topic/3072678 / https://qoder.com/activities | 社区称延期至 11 月 1 日，掘金旧文写 10 月 25 日；官方活动和定价页无可读正文，未确认延期、时区、免费资格和次数；low |
| LightVela | https://linux.do/t/topic/3071717 / https://lightvela.com/about | 官网关于页自述腾讯轻量云出品；订阅页 https://lightvela.com/subscribe 无可读正文；社区标题 2C8G 与正文 4C8G 不一致，三个月赠送及实名/费用待核实；low |
| E2B | https://aispoils.com/type/dev.html / https://e2b.dev/pricing | 官方确认一次性 $100、无需信用卡、20 并发和 1 小时会话；默认规格按当前官网 2 vCPU/4 GiB 记录，不采用第三方旧规格；赠金有效期及耗尽处理待查；medium |

官方证据记录时间：2026-10-25T16:23:24.401Z。所有新条目 lastVerifiedAt 均为 null，未把部分佐证当完整核实；nextReviewAt 为记录后 24 小时。E2B 控制台进入官方 auth.e2b.dev 登录跳转，未继续登录。没有注册、领取、购买或新增付费服务。

## 校验与交付

实际完成 npm run check，退出码 0：22 项既有测试全部通过，6 条正式资源的 Schema/语义校验通过，TypeScript 与 Vite 生产构建通过；git diff --check 通过。npm 仅提示环境 http-proxy 配置将来不兼容，本次检查未失败。数据链接均为 HTTPS，无嵌入凭据、邀请码、执行命令或脚本 URL，按稳定 id 与官方入口去重。

main 写入通过预期源 SHA 检查和非强制更新完成；Pages 按已有 push 工作流构建。提交 SHA、CI 和 Pages 的最终状态在任务最终回复给出，不把这份提交前记录当作部署已成功的证明。

## 待处理

- Qoder：官方客户端的限免截止、时区、国际/国内版本、请求上限及排队规则。
- LightVela：会员活动规则、实际规格、叠加资格、地区/实名、模型积分及到期费用。
- E2B：赠金发放与到期、区域资格、额度耗尽/网络/暂停存储计费。
- 赚客大家谈：下次正常访问复核；本轮来源覆盖未完成该站。
- 云端非 LLM 定时采集器仍未实现，本轮不声称自动监控已启用。
