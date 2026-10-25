import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from '../schema/resources.schema.json';
import type { Catalog } from './types';
export { displayStatus, needsReview, isActiveReviewDue, dueActiveResources, ACTIVE_REVIEW_INTERVAL_MS } from './status';
const ajv = new Ajv({allErrors:true, strict:true});
addFormats(ajv);
const check = ajv.compile<Catalog>(schema);
export function validateCatalog(input: unknown, now = new Date()): string[] {
  if (!check(input)) return (check.errors ?? []).map(e => `${e.instancePath || '/'} ${e.message}`);
  const errors: string[] = [];
  const ids = new Set<string>(), urls = new Set<string>();
  for (const r of input.resources) {
    const fail = (message: string) => errors.push(`${r.id}: ${message}`);
    const official = new URL(r.officialUrl); official.hash = '';
    const canonical = official.href.replace(/\/$/, '');
    if (ids.has(r.id) || urls.has(canonical)) fail('重复 id 或官方入口');
    ids.add(r.id); urls.add(canonical);
    if (Date.parse(r.discoveredAt) > +now) fail('发现时间不能在未来');
    if (r.startsAt && r.endsAt && Date.parse(r.startsAt) >= Date.parse(r.endsAt)) fail('活动起止时间倒序');
    if (r.status !== 'pending' && (!r.lastVerifiedAt || !r.evidence.length || !r.history.length)) fail('非待核实状态必须有官方证据和核实历史');
    if (r.status === 'active' && r.confidence !== 'high') fail('有效状态必须有高可信官方证据');
    if (r.confidence === 'high' && (!r.lastVerifiedAt || !r.evidence.length)) fail('高可信必须有成功核实时间及官方证据');
    if (r.status === 'pending' && r.confidence === 'high') fail('待核实不能标高可信');
    if (r.lastVerifiedAt) {
      const verified = Date.parse(r.lastVerifiedAt);
      if (verified > +now || verified < Date.parse(r.discoveredAt)) fail('核实时间不能在未来或早于发现');
      if (Date.parse(r.nextReviewAt) <= verified) fail('下次复核必须晚于最后核实');
      if (!r.evidence.some(e => Date.parse(e.checkedAt) === verified)) fail('最后核实时间缺少匹配证据');
      const last = r.history.at(-1);
      if (!last || Date.parse(last.at) !== verified || last.status !== r.status) fail('最新历史必须匹配核实时间和状态');
    }
    let previous = -Infinity;
    for (const entry of r.history) {
      const time = Date.parse(entry.at);
      if (time > +now || time < previous || time < Date.parse(r.discoveredAt)) fail('核实历史时间无效或倒序');
      previous = time;
    }
    for (const e of r.evidence) {
      if (Date.parse(e.checkedAt) > +now || Date.parse(e.checkedAt) < Date.parse(r.discoveredAt)) fail('证据时间无效');
    }
    if (r.status === 'upcoming' && !r.startsAt) fail('即将开始需要已知开始时间');
    if (r.status === 'expired' && (!r.endsAt || Date.parse(r.endsAt) > +now)) fail('已过期必须有已到期的截止时间');
  }
  return errors;
}
