# 项目工作约定

中文沟通。先读 docs/core-goals.md 和 docs/mvp-scope.md。
不要自动推送、创建远端仓库或启用付费资源。
正式数据只能使用实际查阅的来源；测试样本只能放 tests，不能进入 data。
逐条核实使用 .agents/skills/resource-research/SKILL.md；多源采集及发布遵守 .agents/skills/resource-collection-publishing/SKILL.md。
Skill 不是定时采集程序，不得在尚未实现/验收自动化时宣称已自动监控、已核实或已发布。
只有网站无法正常访问才尝试 Firecrawl。
代码/数据变更后执行 npm run check，说明未验证的外部能力。
