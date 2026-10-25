# FreeStack Radar

公开、免费、只读的 AI 与云资源福利、免费额度及限时活动信息站。
帮助读者判断资源是否适用、如何领取、什么时候失效，以及证据是否仍然可靠。

## 当前进度

静态站点已部署：[访问 FreeStack Radar](https://somiw.github.io/freestack-radar/)。
已收录首批 3 条真实来源的公开福利记录，其中包含待核实草案；不会使用合成测试样本充数。
采用**草案直发**：真实线索可以 pending 直接更新 main/Pages，不等待人工 PR、全部官方核实或完整 CI 测试；基本 Schema 与构建检查仍保留。云端定时采集器尚未实现。

## 本地运行

使用 Node.js 22.12+（或兼容的新版本）和 npm。

```sh
npm ci
npm run check
npm run dev
```

`npm run check` 包含数据校验、测试、类型检查和生产构建。
`npm run preview` 预览构建结果。依赖版本固定在 package-lock.json。

## 项目约定

- [本轮检查记录](docs/validation-report.md)：本地验证结果与限制。
- [核心目标](docs/core-goals.md)：本次用户明确要求的确认基线。
- [MVP 范围](docs/mvp-scope.md)：首阶段交付和排除项。
- [架构](docs/architecture.md)：数据、研究任务和发布链路。
- [风险与实测记录](docs/risks-and-validation.md)：区分支持声明与账户实测。
- [分阶段计划](docs/plans/2026-10-25-phase-one.md)：执行顺序与验收条件。
- [Resource Research Skill](.agents/skills/resource-research/SKILL.md)：逐条核实官方证据和活动变更。
- [Resource Collection & Publishing Skill](.agents/skills/resource-collection-publishing/SKILL.md)：论坛/聚合站/厂商来源发现、官方核实、可信等级、增量 JSON 更新及 Pages 自动发布的端到端操作规范。
- [监控来源与统一复核规则](.agents/skills/resource-collection-publishing/references/sources.md)：LINUX DO 福利羊毛区、NodeSeek、NodeLoc、AI Spoils、AIdeal、线报酷、AI 福利雷达、赚客大家谈、掘金和厂商官方活动页；重点覆盖免费/超低价 VPS、云服务器、云电脑/AI Agent 沙箱、AI 编程工具、模型 API 免费额度、代金券和官方开发者福利。

正式数据在 `data/resources.json`，契约在 `schema/resources.schema.json`。
远端仓库为 `SomiW/freestack-radar`。用户已授权创建远端及静态站点部署。
`ENABLE_PAGES=true`，Pages 使用 GitHub Actions；main 分支更新会自动检查、构建和发布。
新增的活动字段包括介绍、福利价值、官方领取入口、费用风险、可信程度和核实说明。采集 Skill 要求每次读取正式数据，对所有距上次官方核实已满 24 小时、当前仍有效的活动复核并更新核实时间、证据与历史；不区分厂商。更新 main 并通过校验后会触发 Pages 发布；仅新增 Skill 不会产生数据、不代表定时监控已运行。
不自动开启付费资源；草案写入 main 已授权，但无人值守定时采集任务仍需独立开发和启用。
