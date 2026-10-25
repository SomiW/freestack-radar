export type Status = 'pending' | 'active' | 'upcoming' | 'expired' | 'unavailable';
export interface Resource {
  id: string; title: string; provider: string; category: 'ai' | 'cloud' | 'both';
  officialUrl: string; discoveryUrl: string; discoveredAt: string;
  description: string; benefitValue: string; claimUrl: string; costNotes: string;
  confidence: 'high' | 'medium' | 'low'; confidenceReason: string;
  quota: string; eligibility: string; regions: string; validity: string; deadlineNote: string;
  creditCard: 'required' | 'not-required' | 'unknown'; autoRenewal: 'yes' | 'no' | 'unknown';
  startsAt: string | null; endsAt: string | null; status: Status;
  lastVerifiedAt: string | null; nextReviewAt: string;
  evidence: {url: string; summary: string; checkedAt: string}[];
  history: {at: string; status: Status; note: string}[];
}
export interface Catalog { schemaVersion: 1; resources: Resource[] }
