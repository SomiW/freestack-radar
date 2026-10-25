# FreeStack Radar

公开、免费、只读的 AI 与云资源福利、免费额度及限时活动信息站。
帮助读者判断资源是否适用、如何领取、什么时候失效，以及证据是否仍然可靠。

## 当前进度

首阶段：本地工程与规则建设。正式活动数据为空；不会把测试样本当作采集成果。
云端定时执行、无人值守 Git 写入和 Pages 发布尚未通过端到端实测。

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
- [Resource Research Skill](.agents/skills/resource-research/SKILL.md)：后续研究任务方法。

正式数据在 `data/resources.json`，契约在 `schema/resources.schema.json`。
本地只做 Git 初始化和提交，不设置远端，不自动推送，不开启付费资源。
