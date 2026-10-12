export type PlanId = 'monthly' | 'quarterly' | 'yearly';
export type PaymentMethod = 'click' | 'payme';

export type Plan = {
  id: PlanId;
  price: number;
  months: number;
  discount?: number;
};

export const plans: Plan[] = [
  { id: 'monthly', price: 49_000, months: 1 },
  { id: 'quarterly', price: 119_000, months: 3, discount: 19 },
  { id: 'yearly', price: 349_000, months: 12, discount: 41 },
];

export const paymentMethods: { id: PaymentMethod; title: string }[] = [
  { id: 'click', title: 'Click' },
  { id: 'payme', title: 'Payme' },
];

export const formatSum = (value: number) => String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export const perMonth = (plan: Plan) => Math.round(plan.price / plan.months / 100) * 100;
