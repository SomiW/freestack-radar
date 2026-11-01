# 研究任务提示词（单次运行，无定时执行器）

按当前任务范围先读 AGENTS.md、核心目标及两份 Skill；正常福利运行执行下面流程。
仅维护来源或 Skill 时使用研究 Skill 的维护模式，不自动触发活动复核与发布。

1. 读取最新 main SHA、资源 Schema 与 data/resources.json，记录真实 UTC 时钟并校验基线。
2. 由 resource-research 读取 `.agents/skills/resource-research/references/sources.json`，
   按同目录 `access-paths.md` 选择已验证入口、协议、解析方式和成功判据；
   按 `discovery.md` 筛选、官方核实、去重。按需选源，P0 优先，记录未读取项。
3. 扫描全部当前有效活动，复核满 24 小时或更早 nextReviewAt 到期项；成功追加证据/历史，
   失败不刷新核实时间并报告积压，未到期无变化的存量保持原记录。
4. 未指定发现数量时最多新增 3 条；列表读取窗口与入库上限分开。真实未知条目可 pending，
   官方依据和关键限制充分才 high + active，不继承来源的 verified/status 或转换币价。
5. resource-collection-publishing 接收研究结果并增量写 JSON，保证 Schema/语义与 build 成功；
   完整 check 用于回归或独立 CI，不额外阻塞 pending 草案，不重复网络采集。
6. 按当前提交/推送授权交付；“不推送”仍有效时只留本地结果。获准推送后才检查实际 Pages run
   与线上内容，不能把 Skill 或 Pages 当作已部署采集器。真实结果记录到 docs/research/。

不购买、代领、注册、自动支付、强推、绕过权限或启用付费资源；仅网站完全无法正常访问时
考虑已授权 Firecrawl。没有真实数据差异不制造更新；来源/文档变动不冒称新增福利。
