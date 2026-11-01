import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateSources } from '../scripts/source-registry.ts';

const registry = () => JSON.parse(readFileSync(new URL('../.agents/skills/resource-research/references/sources.json', import.meta.url), 'utf8'));
const requiredIds = [
  'perq', 'aifree', 'aispoils', 'aifuli', 'token-pencil', 'tokentab', 'usefree',
  'linux-do', 'nodeseek', 'lowendtalk', 'lowendbox', 'v2ex', 'free-for-dev',
  'free-llm-api', 'freeaiapis', 'github-pack', 'aws-activate', 'aliyun',
  'tencent-cloud', 'lowseek', 'serverhunter', 'vpsbenchmarks', 'serverdeals',
  'nodeloc', 'aideal', 'xianbao', 'zuanke', 'juejin',
];
const now = new Date('2026-11-01T01:00:00Z');
// 合成来源仅用于测试，不依赖真实平台当前在线状态。
const fixture = () => ({schemaVersion: 1, sources: [{
  id: 'synthetic-source', name: '合成测试来源', url: 'https://example.com/',
  entryUrl: 'https://example.com/feed.xml', priority: 'P0', kind: 'aggregator',
  topics: ['ai-api'], methods: ['rss'], status: 'readable',
  checkedAt: '2026-11-01T00:00:00Z', lastSuccessAt: '2026-11-01T00:00:00Z',
  lastFailure: null as null | {at: string; reason: string},
  canVerifyOfficial: false, observation: '仅用于测试的合成观察',
}]});
test('来源地址与采集入口都拒绝缺少主机名的 HTTPS URL，且返回错误而非抛异常', () => {
  for (const field of ['url', 'entryUrl'] as const) {
    for (const value of ['https://', 'https://?q=test']) {
      const data = fixture();
      data.sources[0][field] = value;
      assert.ok(validateSources(data, now).some(error => error.includes(field)), `${field}: ${value}`);
    }
  }
});
test('来源登记保留全部候选及旧来源，允许后续扩展', () => {
  const data = registry();
  assert.deepEqual(validateSources(data), []);
  for (const id of requiredIds)
    assert.ok(data.sources.some((s: any) => s.id === id), id);
  data.sources.push(fixture().sources[0]);
  assert.deepEqual(validateSources(data), []);
});
test('来源失败可以保留历史成功，但不能伪造可读状态或遗漏失败原因', () => {
  const data = fixture();
  const source = data.sources[0];
  source.status = 'restricted';
  source.lastFailure = { at: source.checkedAt, reason: '合成测试：HTTP 429' };
  assert.deepEqual(validateSources(data, now), []);
  source.lastFailure = null;
  assert.ok(validateSources(data, now).length);
});
test('官方、社区和价格参考来源独立分类，失败入口不阻断登记校验', () => {
  const data = registry();
  for (const id of ['github-pack', 'aws-activate', 'aliyun', 'tencent-cloud']) {
    const source = data.sources.find((s: any) => s.id === id);
    assert.equal(source.kind, 'official');
    assert.equal(source.canVerifyOfficial, true);
  }
  for (const id of ['lowseek', 'serverhunter', 'vpsbenchmarks', 'serverdeals']) {
    const source = data.sources.find((s: any) => s.id === id);
    assert.equal(source.kind, 'price-reference');
    assert.equal(source.canVerifyOfficial, false);
  }
  assert.deepEqual(validateSources(data), []);
});
test('重复来源、未来时间、无效链接与价格参考冒充官方均被拒绝', () => {
  for (const mutate of [
    (d: any) => d.sources.push(d.sources[0]),
    (d: any) => d.sources[0].lastSuccessAt = '2099-01-01T00:00:00Z',
    (d: any) => d.sources[0].url = 'javascript:alert(1)',
    (d: any) => d.sources[0].entryUrl = 'javascript:alert(1)',
    (d: any) => d.sources[0].canVerifyOfficial = true,
  ]) {
    const data = fixture(); mutate(data);
    assert.ok(validateSources(data, now).length);
  }
});
test('合法 RSS、带查询参数的 API 和独立订阅域名均可作采集入口', () => {
  for (const entryUrl of ['https://example.com/feed.xml', 'https://example.com/api?q=credits&limit=3', 'https://feeds.example.org/']) {
    const data = fixture();
    data.sources[0].entryUrl = entryUrl;
    assert.deepEqual(validateSources(data, now), []);
  }
});
test('来源失效与受限均可正常恢复，并保留历史成功与失败', () => {
  for (const status of ['restricted', 'unavailable']) {
    const data = fixture();
    const s = data.sources[0];
    s.status = status;
    s.checkedAt = '2026-11-01T00:30:00Z';
    s.lastFailure = {at: s.checkedAt, reason: '合成测试：暂时不可读'};
    assert.deepEqual(validateSources(data, now), []);
    s.status = 'readable';
    s.checkedAt = s.lastSuccessAt = '2026-11-01T00:45:00Z';
    assert.deepEqual(validateSources(data, now), []);
    assert.equal(s.lastFailure.at, '2026-11-01T00:30:00Z');
  }
});
