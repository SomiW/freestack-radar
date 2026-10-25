# 研究任务提示词（单次运行模板，项目不使用定时执行器）

每次从远端 main 读取最新 SHA、AGENTS.md、两份 Skill、schema/resources.schema.json、data/resources.json 和 Pages 工作流，再执行发现及有效活动 24 小时复核。
重点关注免费/超低价 VPS、云服务器、云电脑与 AI Agent 沙箱、AI 编程工具、模型 API 免费额度、代金券与官方开发者福利；覆盖 LINUX DO 福利羊毛区、NodeSeek、NodeLoc、AI Spoils、AIdeal、线报酷、AI 福利雷达、赚客大家谈、掘金和厂商官网。
真实公开线索最多新发现 3 条/次，按发现链接/官方候选 URL 去重，可直接作为 status=pending 草案加入正式 JSON；未知资格、库存、费用、截止日期明确标记未知。官方证据充足且限制清楚时才允许 active。
**无需人工 PR 审核或逐条官网核实完成才发布。** 保证 Schema/语义与 npm run build 成功，有真实变更直接提交已授权 main，并检查 Pages 实际上线；完整测试通过独立 CI 观察，不作为草案发布前置门槛。
每次扫描全部有效活动，距离 lastVerifiedAt 已满 24 小时则复核，失败不伪造更新时间，成功则追加真实证据、历史和核实时间并发布。不允许付费 API、注册批量账号、自动领取、强推或绕过权限。没有新数据就不提交。本项目不实现定时采集器与 `schedule` workflow，不得声称已自动监控或已无人值守运行。
