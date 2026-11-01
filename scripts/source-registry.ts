import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from '../schema/sources.schema.json';

interface Source {
  id: string;
  url: string;
  entryUrl: string;
  kind: string;
  status: string;
  checkedAt: string;
  lastSuccessAt: string | null;
  lastFailure: { at: string; reason: string } | null;
  canVerifyOfficial: boolean;
}
const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const check = ajv.compile<{ sources: Source[] }>(schema);

/** 只检查来源登记，不联网，也不修改福利状态。 */
export function validateSources(input: unknown, now = new Date()): string[] {
  if (!check(input)) return (check.errors ?? []).map(e => `${e.instancePath || '/'} ${e.message}`);
  const errors: string[] = [];
  const ids = new Set<string>(), urls = new Set<string>();
  for (const s of input.sources) {
    const fail = (reason: string) => errors.push(`${s.id}: ${reason}`);
    let canonical: string | undefined;
    for (const field of ['url', 'entryUrl'] as const) {
      try {
        const url = new URL(s[field]);
        if (url.protocol !== 'https:' || !url.hostname) {
          fail(`${field} 必须是具有有效主机名的 HTTPS URL`);
        } else if (field === 'url') {
          url.hash = '';
          canonical = url.href.replace(/\/$/, '');
        }
      } catch {
        fail(`${field} 必须是具有有效主机名的 HTTPS URL`);
      }
    }
    if (ids.has(s.id) || (canonical && urls.has(canonical))) fail('重复来源 id 或 URL');
    ids.add(s.id);
    if (canonical) urls.add(canonical);
    const checked = Date.parse(s.checkedAt);
    if (checked > +now) fail('来源检查时间不能在未来');
    for (const at of [s.lastSuccessAt, s.lastFailure?.at]) {
      if (at && Date.parse(at) > checked) fail('成功或失败时间不能晚于来源检查时间');
    }
    if (s.status === 'readable' && (!s.lastSuccessAt || Date.parse(s.lastSuccessAt) !== checked))
      fail('可读状态必须有本次成功采集时间');
    if (['restricted', 'unavailable'].includes(s.status) &&
        (!s.lastFailure || Date.parse(s.lastFailure.at) !== checked))
      fail('受限或失效必须记录本次失败原因与时间');
    if (s.canVerifyOfficial && s.kind !== 'official') fail('第三方来源不能作为官方核实依据');
  }
  return errors;
}
