export type PlanId = 'monthly' | 'quarterly' | 'yearly';
export type PaymentMethod = 'click' | 'payme';

export type Plan = {
  id: PlanId;
  title: string;
  price: number;
  months: number;
  discount?: number;
};

export const plans: Plan[] = [
  { id: 'monthly', title: 'Oylik', price: 49_000, months: 1 },
  { id: 'quarterly', title: '3 oylik', price: 119_000, months: 3, discount: 19 },
  { id: 'yearly', title: 'Yillik', price: 349_000, months: 12, discount: 41 },
];

export const features = [
  'Cheksiz mock testlar — 40+',
  'AI Writing va Speaking baholash',
  "Har bir savol bo'yicha tushuntirish",
  'Shaxsiy tayyorgarlik rejasi',
];

export const paymentMethods: { id: PaymentMethod; title: string; letter: string }[] = [
  { id: 'click', title: 'Click', letter: 'C' },
  { id: 'payme', title: 'Payme', letter: 'P' },
];

export const formatSum = (value: number) => String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export const perMonth = (plan: Plan) => Math.round(plan.price / plan.months / 100) * 100;
