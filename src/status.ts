import type { Resource, Status } from './types';
export const labels: Record<Status, string> = {
  pending: '待核实', active: '有效', upcoming: '即将开始', expired: '已过期', unavailable: '已失效',
};
export function displayStatus(r: Resource, now = new Date()): Status {
  if (r.status === 'unavailable' || r.status === 'expired') return r.status;
  if (r.endsAt && Date.parse(r.endsAt) <= now.getTime()) return 'expired';
  if (r.status === 'pending') return 'pending';
  if (r.startsAt && Date.parse(r.startsAt) > now.getTime()) return 'upcoming';
  // 开始时间经过并不能证明活动已经开放领取。
  if (r.status === 'upcoming') return 'pending';
  return r.status;
}
/** 所有当前有效且距上次成功核实已满 24 小时的活动（与 nextReviewAt 无关）。 */
export const ACTIVE_REVIEW_INTERVAL_MS = 24 * 60 * 60 * 1000;
export function isActiveReviewDue(r: Resource, now = new Date()): boolean {
  if (displayStatus(r, now) !== 'active') return false;
  if (!r.lastVerifiedAt) return true; // 非法/缺失数据仍须进入复核待办，不可静默略过
  const verified = Date.parse(r.lastVerifiedAt);
  return !Number.isFinite(verified) || now.getTime() - verified >= ACTIVE_REVIEW_INTERVAL_MS;
}
export function dueActiveResources(resources: Resource[], now = new Date()): Resource[] {
  const verifiedTime = (r: Resource) => {
    const parsed = r.lastVerifiedAt ? Date.parse(r.lastVerifiedAt) : NaN;
    return Number.isFinite(parsed) ? parsed : -Infinity;
  };
  return resources.filter(r => isActiveReviewDue(r, now))
    .sort((a, b) => verifiedTime(a) - verifiedTime(b) || a.id.localeCompare(b.id));
}
export function needsReview(r: Resource, now = new Date()): boolean {
  return isActiveReviewDue(r, now) || Date.parse(r.nextReviewAt) <= now.getTime();
}
