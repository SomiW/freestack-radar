# 项目工作约定

中文沟通。先读 docs/core-goals.md 和 docs/mvp-scope.md。
明确授权草案直发：真实候选可直接提交 main 并触发 Pages，无需人工 PR 审核或全面核实后才展示。禁止强推、绕过分支保护、创建额外远端仓库或启用付费资源。
正式数据只能使用真实、可追溯的公开来源；尚未完全核实的真实线索必须标 pending，明确披露不确定性，不可假冒 active。合成测试样本只能放 tests。
逐条核实使用 .agents/skills/resource-research/SKILL.md；多源采集及发布遵守 .agents/skills/resource-collection-publishing/SKILL.md。
运行方式：**项目按 Skill 驱动运行**——不实现定时采集器，也不新增 GitHub Actions `schedule` 定时 workflow。发现、复核、写入与发布由人工或 Agent 按需触发，按上述两个 Skill 的流程执行，每次运行的真实结果记录到 `docs/research/`。
Skill 不是定时程序，Pages 工作流只负责构建部署；不得把 Skill 或 `.github/workflows/pages.yml` 描述成“已自动监控”“已无人值守运行”，也不得虚构核实与发布结果。
只有网站无法正常访问才尝试 Firecrawl。
数据发布仅要求 JSON Schema/语义有效与 npm run build 能构建；完整 npm run check 可在独立 CI 运行，不再阻塞待核实草案。任何失败都要报告，不得虚构已发布结果。
