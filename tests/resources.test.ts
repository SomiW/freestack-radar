import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateCatalog, displayStatus, needsReview } from '../src/resources.ts';

// 明确的合成夹具，只用于测试，不导入正式页面或 data。
const now = new Date('2026-10-25T12:00:00Z');
const resource = () => ({
  id: 'synthetic-only', title: '合成测试资源（非真实活动）', provider: '测试提供方',
  category: 'ai', officialUrl: 'https://example.com/test',
  discoveryUrl: 'https://example.com/discovery', discoveredAt: '2026-10-20T00:00:00Z',
  quota: '测试额度', eligibility: '测试资格', regions: '未知',
  creditCard: 'unknown', autoRenewal: 'unknown', validity: '未披露',
  startsAt: null, endsAt: null, deadlineNote: '官方未披露截止时间',
  status: 'active', lastVerifiedAt: '2026-10-24T00:00:00Z', nextReviewAt: '2026-10-26T00:00:00Z',
  evidence: [{url:'https://example.com/terms', summary:'合成测试证据', checkedAt:'2026-10-24T00:00:00Z'}],
  history: [{at:'2026-10-24T00:00:00Z', status:'active', note:'合成核实记录'}],
});
const catalog = (resources: unknown[]) => ({schemaVersion:1, resources});
test('空目录合法，不需要填充假数据', () => assert.deepEqual(validateCatalog(catalog([]),now),[]));
test('未知截止日期可以明确披露', () => assert.deepEqual(validateCatalog(catalog([resource()]),now),[]));
test('缺少官方证据不能标记有效', () => {
  assert.ok(validateCatalog(catalog([{...resource(),evidence:[]}]),now).length);
});
test('待核实可没有成功核实时间', () => {
  const r={...resource(),status:'pending',lastVerifiedAt:null,evidence:[],history:[]};
  assert.deepEqual(validateCatalog(catalog([r]),now),[]);
});
test('拒绝重复 id 和重复官方链接', () => {
  assert.ok(validateCatalog(catalog([resource(),resource()]),now).some(x=>x.includes('重复')));
});
test('拒绝脚本链接、额外字段和无效日期', () => {
  for (const patch of [{officialUrl:'javascript:alert(1)'},{extra:true},{endsAt:'2026-02-30T00:00:00Z'}])
    assert.ok(validateCatalog(catalog([{...resource(),...patch}]),now).length);
});
test('拒绝未来核实时间与倒序活动日期', () => {
  for(const patch of [{lastVerifiedAt:'2027-01-01T00:00:00Z'},
    {startsAt:'2026-11-01T00:00:00Z',endsAt:'2026-10-01T00:00:00Z'}])
    assert.ok(validateCatalog(catalog([{...resource(),...patch}]),now).length);
});
test('核实时间必须有匹配证据和历史', () => {
  assert.ok(validateCatalog(catalog([{...resource(),lastVerifiedAt:'2026-10-23T00:00:00Z'}]),now).length);
});
test('历史和证据不能来自未来', () => {
  const r=resource(); r.history[0].at='2027-01-01T00:00:00Z';
  assert.ok(validateCatalog(catalog([r]),now).length);
});
test('日期到期自动显示已过期，失效状态保持失效', () => {
  assert.equal(displayStatus({...resource(),endsAt:'2026-10-25T12:00:00Z'} as any,now),'expired');
  assert.equal(displayStatus({...resource(),status:'unavailable'} as any,now),'unavailable');
});
test('待核实不会因为日期被升级为有效', () => {
  assert.equal(displayStatus({...resource(),status:'pending'} as any,now),'pending');
});
test('即将开始时间到了但没有复核时标为待核实', () => {
  assert.equal(displayStatus({...resource(),status:'upcoming',startsAt:'2026-10-25T00:00:00Z'} as any,now),'pending');
});
test('复核到期独立于资源状态', () => {
  assert.equal(needsReview({...resource(),nextReviewAt:'2026-10-25T12:00:00Z'} as any,now),true);
  assert.equal(needsReview(resource() as any,now),false);
});
