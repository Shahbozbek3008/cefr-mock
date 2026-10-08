export const PLAN_IDS = ['monthly', 'quarterly', 'yearly'] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export const BASE_FEATURES = ['allMocks', 'aiWritingSpeaking', 'analysis'] as const;
export type PlanFeature = (typeof BASE_FEATURES)[number] | 'personalPlan' | 'offline';

export type PlanInfo = {
  id: PlanId;
  price: number;
  perMonth?: number;
  discount?: number;
  fullPrice?: number;
  features: readonly PlanFeature[];
};

export const PLANS: readonly PlanInfo[] = [
  { id: 'monthly', price: 49_000, features: BASE_FEATURES },
  { id: 'quarterly', price: 119_000, perMonth: 39_700, discount: 19, fullPrice: 147_000, features: [...BASE_FEATURES, 'personalPlan'] },
  { id: 'yearly', price: 349_000, perMonth: 29_100, discount: 41, fullPrice: 588_000, features: [...BASE_FEATURES, 'personalPlan', 'offline'] },
];

export const RECOMMENDED_PLAN: PlanId = 'quarterly';

export const PRO_FEATURES = ['unlimited', 'aiWritingSpeaking', 'explanations', 'personalPlan'] as const;

export const PAYMENT_METHODS = [
  { value: 'click', name: 'Click', letter: 'C', color: 'oklch(0.6 0.14 235)' },
  { value: 'payme', name: 'Payme', letter: 'P', color: 'oklch(0.68 0.12 190)' },
] as const;
