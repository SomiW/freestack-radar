# 项目工作约定

中文沟通。先读 docs/core-goals.md 和 docs/mvp-scope.md。
明确授权草案直发：真实候选可直接提交 main 并触发 Pages，无需人工 PR 审核或全面核实后才展示。禁止强推、绕过分支保护、创建额外远端仓库或启用付费资源。
正式数据只能使用真实、可追溯的公开来源；尚未完全核实的真实线索必须标 pending，明确披露不确定性，不可假冒 active。合成测试样本只能放 tests。
逐条核实使用 .agents/skills/resource-research/SKILL.md；多源采集及发布遵守 .agents/skills/resource-collection-publishing/SKILL.md。
Skill 不是定时采集程序，不得在尚未实现/验收自动化时宣称已自动监控、已核实或已发布。
只有网站无法正常访问才尝试 Firecrawl。
数据发布仅要求 JSON Schema/语义有效与 npm run build 能构建；完整 npm run check 可在独立 CI 运行，不再阻塞待核实草案。任何失败都要报告，不得虚构已发布结果。
