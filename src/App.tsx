import { useEffect, useState } from 'react';
import data from '../data/resources.json';
import type { Catalog, Resource, Status } from './types';
import { displayStatus, needsReview, labels } from './status';
const catalog = data as Catalog; // 构建前由 Schema 和语义校验阻止无效数据发布。
const date = (value: string | null) => value ? new Date(value).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false }) : '未披露';
function ResourceCard({resource: r, now}: {resource: Resource; now: Date}) {
  return <article className="resource">
    <div className="eyebrow">{r.provider} · {r.category.toUpperCase()}</div>
    <h3>{r.title}</h3><p>{r.description}</p><span className="badge">{displayStatus(r, now)==='pending'?'草案 · 待核实':labels[displayStatus(r, now)]}</span>
    <span className="badge">可信程度：{{high:'高',medium:'中',low:'低'}[r.confidence]}</span>
    {needsReview(r, now) && <span className="badge warning">已到复核时间</span>}
    <dl>
      <dt>额度 / 福利</dt><dd>{r.quota}</dd><dt>福利价值</dt><dd>{r.benefitValue}</dd>
      <dt>核实依据</dt><dd>{r.confidenceReason}</dd><dt>费用与风险</dt><dd>{r.costNotes}</dd>
      <dt>领取条件</dt><dd>{r.eligibility}</dd>
      <dt>适用地区</dt><dd>{r.regions}</dd><dt>信用卡</dt><dd>{{required:'需要', 'not-required':'不需要', unknown:'未知'}[r.creditCard]}</dd>
      <dt>自动续费</dt><dd>{{yes:'是', no:'否', unknown:'未知'}[r.autoRenewal]}</dd>
      <dt>额度有效期</dt><dd>{r.validity}</dd><dt>活动时间</dt><dd>{date(r.startsAt)} 至 {date(r.endsAt)}；{r.deadlineNote}</dd>
      <dt>最后核实</dt><dd>{r.lastVerifiedAt ? date(r.lastVerifiedAt) : '尚未核实'}</dd><dt>下次复核</dt><dd>{date(r.nextReviewAt)}</dd>
    </dl>
    <a href={r.officialUrl} target="_blank" rel="noopener noreferrer">查看官方活动介绍 ↗</a>{' · '}
    <a href={r.claimUrl} target="_blank" rel="noopener noreferrer">打开官方领取入口 ↗</a>
    <details><summary>官方证据与核实历史</summary>
      <p>发现于 {date(r.discoveredAt)} · <a href={r.discoveryUrl}>发现来源</a></p>
      {r.evidence.map((e,i)=><p key={i}><a href={e.url}>官方证据 {i+1}</a> · {date(e.checkedAt)}<br/>{e.summary}</p>)}
      {r.history.map((h,i)=><p key={i}>{date(h.at)} · {labels[h.status]} · {h.note}</p>)}
    </details>
  </article>;
}
export function App() {
  const [view, setView] = useState<'current'|'archive'>('current');
  const [filter, setFilter] = useState('all');
  const [now, setNow] = useState(()=>new Date());
  useEffect(()=>{const timer=setInterval(()=>setNow(new Date()),60_000);return ()=>clearInterval(timer);},[]);
  const archived = (r: Resource) => ['expired','unavailable'].includes(displayStatus(r,now));
  const group = catalog.resources.filter(r=>archived(r)===(view==='archive'));
  const visible = group.filter(r=>filter==='all'||displayStatus(r,now)===filter);
  return <><header><a className="brand" href="./"><span className="radar">◎</span> FreeStack Radar</a><span className="header-note">公开 · 免费 · 只读</span></header>
    <main><section className="hero"><p className="eyebrow">AI & CLOUD RESOURCE DIRECTORY</p>
      <h1>发现免费资源，<br/><span>先看清条件。</span></h1>
      <p className="intro">汇集 AI 与云资源的免费额度和限时活动。<br/>真实福利线索可标“草案 · 待核实”先公开；实际领取条件和库存以官方最新信息为准。</p>
      <div className="principles"><span>01 官方来源</span><span>02 条件透明</span><span>03 历史可查</span></div>
    </section>
    <section aria-label="资源目录"><div className="toolbar"><div className="tabs" aria-label="目录范围">
      <button aria-pressed={view==='current'} onClick={()=>{setView('current');setFilter('all');}}>资源目录</button>
      <button aria-pressed={view==='archive'} onClick={()=>{setView('archive');setFilter('all');}}>历史归档</button></div>
      <label>状态 <select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">全部状态</option>
      {(view==='current'?['pending','active','upcoming']:['expired','unavailable']).map(s=><option key={s} value={s}>{labels[s as Status]}</option>)}</select></label></div>
      <p className="count" aria-live="polite">{visible.length} 条{view==='archive'?'历史':'资源'}记录</p>
      {visible.length ? <div className="grid">{visible.map(r=><ResourceCard key={r.id} resource={r} now={now}/>)}</div> :
        <div className="empty"><span className="empty-icon">◎</span><h2>{view==='archive'?'暂无历史归档':group.length?'没有符合条件的资源':'第一批资源，等待核实'}</h2>
          <p>{view==='archive'?'已过期或已失效的信息将保留在这里，方便追溯。':group.length?'试试其他状态。':'目前尚未收录正式资源。核实官方证据后，才会发布额度、领取条件和有效期。'}</p>
          <span className="small">只展示有依据的信息，不用示例填充目录。</span></div>}
    </section><aside className="method"><h2>如何阅读这份目录</h2><p>“草案 · 待核实”不代表已确认可领取；“有效”只代表最后一次官网条款核实，不保证个人资格或库存。请关注收费、时效与复核提示。</p></aside>
    </main><footer>FreeStack Radar · 信息以官方最新条款为准。<span>时间显示：北京时间</span></footer></>;
}
