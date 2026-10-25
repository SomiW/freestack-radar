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
export function needsReview(r: Resource, now = new Date()): boolean {
  return Date.parse(r.nextReviewAt) <= now.getTime();
}
