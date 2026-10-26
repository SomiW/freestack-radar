import { useEffect, useMemo, useState } from 'react';
import data from '../data/resources.json';
import type { Catalog, Resource, Status } from './types';
import { displayStatus, needsReview, labels } from './status';

const catalog = data as Catalog; // 构建前由 Schema 和语义校验阻止无效数据发布。

const confidenceLabel = { high: '高可信', medium: '中可信', low: '低可信' } as const;
const categoryLabel = { ai: 'AI 工具', cloud: '云与基础设施', both: 'AI + 云' } as const;
const creditLabel = { required: '需要信用卡', 'not-required': '无需信用卡', unknown: '信用卡未知' } as const;
const autoLabel = { yes: '会自动续费', no: '不会自动续费', unknown: '续费未知' } as const;
const sortLabel = { default: '优先级', verified: '最近核实', review: '复核最早' } as const;
const statusRank: Record<Status, number> = { active: 0, upcoming: 1, pending: 2, expired: 3, unavailable: 4 };

function dateTime(value: string | null): string {
  if (!value) return '未披露';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '未披露';
  return d.toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

function dateShort(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '时间未知';
  return d.toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

function relative(value: string | null, now: Date): string {
  if (!value) return '尚未核实';
  const t = Date.parse(value);
  if (!Number.isFinite(t)) return '时间未知';
  const diff = t - now.getTime();
  const abs = Math.abs(diff);
  if (abs < 60_000) return diff <= 0 ? '刚刚' : '即将';
  const units: Array<[number, string]> = [[86_400_000, '天'], [3_600_000, '小时'], [60_000, '分钟']];
  const [size, unit] = units.find(([ms]) => abs >= ms)!;
  const n = Math.floor(abs / size);
  return diff < 0 ? `${n}${unit}前` : `${n}${unit}后`;
}

function Logo() {
  return (
    <svg className="logo" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="14" cy="14" r="11" opacity=".35" />
      <circle cx="14" cy="14" r="6" opacity=".6" />
      <path d="M14 14 21.5 7.5" strokeLinecap="round" />
      <circle cx="14" cy="14" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ResourceRow({ resource: r, now }: { resource: Resource; now: Date }) {
  const status = displayStatus(r, now);
  const overdue = Date.parse(r.nextReviewAt) <= now.getTime();
  const period = r.startsAt || r.endsAt
    ? `${r.startsAt ? dateTime(r.startsAt) : '未披露'} 至 ${r.endsAt ? dateTime(r.endsAt) : '未披露'}`
    : '未披露起止时间';
  const fields: Array<[string, string]> = [
    ['福利价值', r.benefitValue],
    ['费用与风险', r.costNotes],
    ['领取条件', r.eligibility],
    ['适用地区', r.regions],
    ['信用卡', creditLabel[r.creditCard]],
    ['自动续费', autoLabel[r.autoRenewal]],
    ['额度有效期', r.validity],
    ['活动时间', period],
    ['截止说明', r.deadlineNote],
    ['发现时间', dateTime(r.discoveredAt)],
    ['最后核实', r.lastVerifiedAt ? `${dateTime(r.lastVerifiedAt)}（${relative(r.lastVerifiedAt, now)}）` : '尚未核实'],
    ['下次复核', overdue ? `已逾期 · 原定 ${dateShort(r.nextReviewAt)}` : dateTime(r.nextReviewAt)],
  ];

  return (
    <article className={`row s-${status}`}>
      <div className="rail">
        <span className="pill">{labels[status]}</span>
        <span className={`conf conf-${r.confidence}`}>
          <i aria-hidden="true" />
          {confidenceLabel[r.confidence]}
        </span>
        {needsReview(r, now) && <span className="due">{overdue ? '复核逾期' : '待复核'}</span>}
      </div>

      <div className="body">
        <p className="source">
          {r.provider} <span aria-hidden="true">·</span> {categoryLabel[r.category]}
        </p>
        <h3>{r.title}</h3>
        <p className="desc">{r.description}</p>
        <dl className="facts">
          <div><dt>额度</dt><dd>{r.quota}</dd></div>
          <div><dt>门槛</dt><dd>{creditLabel[r.creditCard]} · {r.eligibility}</dd></div>
          <div><dt>有效期</dt><dd>{r.validity}</dd></div>
        </dl>

        <details className="more">
          <summary>
            完整条件、费用与证据
            <span>（{r.evidence.length} 条证据 · {r.history.length} 条核实记录）</span>
          </summary>
          <div className="detail">
            <dl className="detail-grid">
              {fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
            <div className="evidence">
              <h4>官方证据</h4>
              {r.evidence.length ? (
                <ul>
                  {r.evidence.map((e, i) => (
                    <li key={e.url + i}>
                      <a href={e.url} target="_blank" rel="noopener noreferrer">官方证据 {i + 1} ↗</a>
                      <span className="fine"> · 读取于 {dateTime(e.checkedAt)}</span>
                      <p>{e.summary}</p>
                    </li>
                  ))}
                </ul>
              ) : <p className="fine">尚未取得官方证据，仅以草案形式公开。</p>}
              <h4>核实历史</h4>
              <ul>
                {r.history.length ? r.history.map((h, i) => (
                  <li key={h.at + i}>
                    <span className="fine">{dateTime(h.at)}</span> · {labels[h.status]}
                    <p>{h.note}</p>
                  </li>
                )) : <li className="fine">暂无核实记录。</li>}
              </ul>
              <p className="fine">
                发现于 {dateTime(r.discoveredAt)} ·{' '}
                <a href={r.discoveryUrl} target="_blank" rel="noopener noreferrer">发现来源 ↗</a>
              </p>
            </div>
          </div>
        </details>
      </div>

      <div className="side">
        <a className="btn btn-primary" href={r.claimUrl} target="_blank" rel="noopener noreferrer">领取入口 ↗</a>
        <a className="btn" href={r.officialUrl} target="_blank" rel="noopener noreferrer">官方介绍 ↗</a>
        <p className="meta">
          最后核实 {relative(r.lastVerifiedAt, now)}<br />
          下次复核 {overdue ? '已逾期' : dateShort(r.nextReviewAt)}
        </p>
      </div>
    </article>
  );
}

export function App() {
  const [view, setView] = useState<'current' | 'archive'>('current');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | Resource['category']>('all');
  const [sort, setSort] = useState<'default' | 'verified' | 'review'>('default');
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const archive = (r: Resource) => ['expired', 'unavailable'].includes(displayStatus(r, now));
  const group = catalog.resources.filter(r => archive(r) === (view === 'archive'));
  const needle = query.trim().toLowerCase();
  const visible = group
    .filter(r => filter === 'all' || displayStatus(r, now) === filter)
    .filter(r => category === 'all' || r.category === category)
    .filter(r => !needle || [r.title, r.provider, r.description, r.quota, r.eligibility, r.regions, r.confidenceReason]
      .join(' ').toLowerCase().includes(needle))
    .sort((a, b) => {
      if (sort === 'verified') return Date.parse(b.lastVerifiedAt ?? '') - Date.parse(a.lastVerifiedAt ?? '');
      if (sort === 'review') return Date.parse(a.nextReviewAt) - Date.parse(b.nextReviewAt);
      return statusRank[displayStatus(a, now)] - statusRank[displayStatus(b, now)]
        || Date.parse(a.nextReviewAt) - Date.parse(b.nextReviewAt);
    });

  const counts = useMemo(() => {
    const c: Record<Status, number> = { pending: 0, active: 0, upcoming: 0, expired: 0, unavailable: 0 };
    catalog.resources.forEach(r => { c[displayStatus(r, now)] += 1; });
    return c;
  }, [now]);
  const evidenceTotal = catalog.resources.reduce((sum, r) => sum + r.evidence.length, 0);
  const archivedTotal = counts.expired + counts.unavailable;
  const filtered = filter !== 'all' || category !== 'all' || needle.length > 0;

  const resetFilters = () => { setFilter('all'); setCategory('all'); setQuery(''); };

  return (
    <>
      <a className="skip" href="#catalog">跳到资源目录</a>
      <header className="top">
        <div className="wrap top-inner">
          <a className="brand" href="./"><Logo /><span>FreeStack Radar</span></a>
          <span className="tag">公开 · 免费 · 只读</span>
        </div>
      </header>

      <main>
        <section className="wrap hero">
          <p className="kicker">AI 与云资源福利目录</p>
          <h1>免费额度，<em>先看清条件。</em></h1>
          <p className="lede">
            汇集 AI 与云资源的免费额度与限时活动。每条记录标注官方证据、领取门槛、费用风险与下次复核时间；
            草案经真实来源先行公开，领取条件以官网最新条款为准。
          </p>
          <ul className="stats">
            <li>{catalog.resources.length} 条记录</li>
            <li>{counts.active} 条有效</li>
            <li>{counts.pending} 条待核实</li>
            <li>{archivedTotal} 条已归档</li>
            <li>{evidenceTotal} 条官方证据</li>
          </ul>
        </section>

        <div className="toolbar">
          <div className="wrap toolbar-inner">
            <div className="toolbar-row">
              <div className="seg" role="group" aria-label="目录范围">
                <button aria-pressed={view === 'current'} onClick={() => { setView('current'); setFilter('all'); }}>资源目录</button>
                <button aria-pressed={view === 'archive'} onClick={() => { setView('archive'); setFilter('all'); }}>历史归档</button>
              </div>
              <div className="search">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <circle cx="9" cy="9" r="5.5" /><path d="m13.5 13.5 4 4" strokeLinecap="round" />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="搜索厂商、资源或条件"
                  aria-label="搜索厂商、资源或条件"
                />
              </div>
            </div>

            <div className="toolbar-row filters">
              <div className="chips" role="group" aria-label="按分类筛选">
                {([['all', '全部'], ['ai', 'AI 工具'], ['cloud', '云与基础设施'], ['both', 'AI + 云']] as const).map(([value, text]) => (
                  <button key={value} aria-pressed={category === value} onClick={() => setCategory(value)}>{text}</button>
                ))}
              </div>
              <label className="field">状态
                <select value={filter} onChange={e => setFilter(e.target.value)}>
                  <option value="all">全部状态</option>
                  {(view === 'current' ? ['pending', 'active', 'upcoming'] : ['expired', 'unavailable']).map(s => (
                    <option key={s} value={s}>{labels[s as Status]}</option>
                  ))}
                </select>
              </label>
              <label className="field">排序
                <select value={sort} onChange={e => setSort(e.target.value as typeof sort)}>
                  {Object.entries(sortLabel).map(([value, text]) => <option key={value} value={value}>{text}</option>)}
                </select>
              </label>
              <p className="count" aria-live="polite">{visible.length} 条{filtered ? ` / ${group.length}` : ''}</p>
            </div>
          </div>
        </div>

        <section className="wrap catalog" id="catalog" aria-label="资源目录">
          <h2 className="sr-only">资源目录</h2>
          {visible.length ? (
            <div className="list">
              {visible.map(r => <ResourceRow key={r.id} resource={r} now={now} />)}
            </div>
          ) : (
            <div className="empty">
              <h2>{view === 'archive' ? '暂无历史归档' : filtered ? '没有符合条件的记录' : '第一批资源，等待核实'}</h2>
              <p>
                {view === 'archive'
                  ? '已过期或已失效的信息会保留在这里，方便追溯。'
                  : filtered
                    ? '换个关键词或状态试试；目录只展示有真实来源的信息。'
                    : '目前尚未收录正式资源。核实官方证据后，才会发布额度、领取条件和有效期。'}
              </p>
              {filtered && <button className="btn" onClick={resetFilters}>清除筛选条件</button>}
            </div>
          )}
        </section>

        <aside className="wrap read">
          <h2>如何阅读这份目录</h2>
          <div className="read-grid">
            <p><strong>状态</strong>「待核实」代表来源真实但条款未完全确认；「有效」只代表最后一次官网核实通过，不等于个人资格或库存仍然成立。</p>
            <p><strong>复核</strong>有效活动距上次核实满 24 小时会重新核对；逾期未复核单独标出，历史记录保留每次结论与变化。</p>
            <p><strong>费用</strong>额度、地区、信用卡与自动续费按官方原文填写，未披露就写未知，不用估算值补全。</p>
          </div>
        </aside>
      </main>

      <footer>
        <div className="wrap footer-inner">
          <span>FreeStack Radar · 信息以官方最新条款为准</span>
          <span>时间均为北京时间 · 无追踪</span>
        </div>
      </footer>
    </>
  );
}
