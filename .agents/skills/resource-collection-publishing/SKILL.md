---
name: resource-collection-publishing
description: 为 FreeStack Radar 编排研究结果交接、增量更新 JSON、质量门禁以及 GitHub Pages 发布；网络采集和活动核实由 resource-research 负责。用于按需运行、结果交付和发布排障，不负责代领或注册账号。
---

# Resource Collection & Publishing

负责接收研究结果、增量写入、校验和授权内的 Git/Pages 交付。
网络采集与官方核实由 [resource-research](../resource-research/SKILL.md) 执行，
不在本 Skill 重复抓取或补造核实结果。项目无定时采集器，Pages 仅构建部署。

## 判断范围与读取基线

先读 `AGENTS.md`、`docs/core-goals.md`、`docs/architecture.md`、
`schema/resources.schema.json`、`data/resources.json` 和 `.github/workflows/pages.yml`。

- 来源/Skill 维护：由研究 Skill 按指定范围处理，不自动执行活动复核或发布。
- 正常运行：将来源发现与存量复核交给研究 Skill；接收结果后执行本 Skill。
- 已有研究结果的校验/交付：只检查交接证据与数据差异，不重新联网研究。

保留当前用户的提交/推送限制；没有针对本轮的新授权时，不用历史草案直发权限覆盖“不推送”。
没有额外限制时按仓库既有授权直接 main 交付，无需强制 PR 或人工审批；禁止强推和绕过保护。

## 接收研究结果

研究范围与抓取方式以 [研究规则](../resource-research/references/discovery.md) 和
[抓取手册](../resource-research/references/access-paths.md) 为准，发布只检查交接是否完整。

1. 取得源 SHA、研究 UTC 时钟、来源实际成功/失败/未读取清单、去重候选和存量复核结果。
2. 检查所有当前有效活动的满 24 小时复核及更早 nextReviewAt 已由研究环节处理或列为积压；
   不按厂商设置例外，不把未到期且无变化的条目强制重核。
3. 检查新标 active 的候选必须 high，且有本轮实际读取的官方依据与关键限制；
   medium/low 候选保持 pending。来源自带 verified、评分与价格参考不能代替官方核实。
4. 真实 pending 草案可直接交付，未知资格/库存/费用/时间必须披露；有部分官方事实可以保留
   实际证据，缺少官方证明则 evidence 为空、lastVerifiedAt 为 null，不伪装 active。

## 增量写入合同

只写正式 `data/resources.json`，以现有 Schema 为字段清单，不新增影子数据或不兼容字段。

- 同一活动保留 id 与主 discoveryUrl，跨来源发现链接留研究报告；不重复官方入口、
  不覆盖其它活动轮次，不删旧 evidence/history。新轮次与共用入口冲突按研究结果处理，不能绕过校验。
- 本轮成功复核即使业务条款未变也追加 evidence/history、更新 lastVerifiedAt，
  nextReviewAt 设为 24 小时后或更早边界；未到期且无变化的存量 active 沿用此前可信记录。
- 失败保留原记录及核实时间，报告积压，不能将网络故障当成 unavailable；
  官方确认结束/撤销才持久化 expired/unavailable 并保留历史。展示状态继续由 `src/status.ts` 处理。
- 写入前比较源 SHA 与当前文件，避免覆盖已有修改；冲突最多重读并重算一次，再冲突则停止。
- 没有活动新增、事实变化或成功复核元数据时，不制造福利数据差异；
  来源维护或文档变化只按当前任务交付，不能冒称采集到新福利。合成样本仅留 tests。

## 校验与发布

技术底线与发布结果必须分别确认，不能把构建成功当作线上已更新。

1. 运行 `npm run validate:data`、`npm run build`，检查 Schema/语义、类型及构建。
   来源受限/失效是允许的数据结果，不因可用状态本身阻断构建；格式或语义错误必须修复。
2. 修改代码/校验或需要回归时运行 `npm run check`；完整测试也由独立 CI 执行，
   不是新增的 pending 发布前置门槛。所有失败/未执行项如实记录。
3. 检查本轮文件差异；仅按授权提交/推送。未授权推送时停在本地可审阅结果，
   未提交不编造 SHA，未推送不声称触发 Pages。默认无强制 PR/人工审核。
4. 获准推送后，检查对应提交的 Pages run 与线上实际内容；Pages 需要 main 和 ENABLE_PAGES=true，
   `.github/workflows/pages.yml` 不负责采集，`.github/workflows/ci.yml` 执行完整检查。
   发布失败保留本地成果并报告，不改分支保护、付费资源或调度设置。

## 运行报告

每次真实运行写入 `docs/research/YYYY-MM-DD-*.md`，字段足以区分已执行和未执行部分。

```text
任务范围/UTC 时钟/环境/源 SHA：
来源：选取 N / 成功 N / 失败 N / 未读取 N；逐源 URL、方法、时间、解析结果
候选：新发现/去重/排除/入库 N；原始标题、发现链接、官方候选、fingerprint
存量：有效 N / 满 24 小时 N / 更早到期 N / 复核成功 N / 失败 N / 未处理 N
证据：逐条官方 URL、读取时间、已确认事实、未知限制、状态与变化
检查：实际命令/结果；未运行原因；本地预览或视觉检查的实际范围
交付：文件差异/无变化/提交 SHA（如有）/未提交或未推送
发布：未触发，或 Pages run URL、结果及线上抽检；阻碍和后续待办
```

疑似恶意链接、虚构来源、Schema/构建失败、缺少写权限或未解决冲突时停止写入/发布。
仅官方条件不足时保持 pending，不另加全面核实或人工审核门槛。
