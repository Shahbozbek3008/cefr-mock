'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Lock, ReceiptText, RotateCcw, ShieldCheck, Tag as TagIcon } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { PLANS, PRO_FEATURES, RECOMMENDED_PLAN, type PlanId } from '@/lib/mock/plans';
import { formatSum } from '@/lib/format';
import { Icon } from '@/components/ui/icon';
import { LogoMark } from '@/components/ui/logo';
import { ButtonLink } from '@/components/ui/button';
import { panelSurface } from '@/components/dashboard/panel';
import { PlanPicker } from './plan-picker';
import { PaymentMethods } from './payment-methods';

const TRUST = [
  { key: 'secure', icon: ShieldCheck },
  { key: 'cancel', icon: RotateCcw },
  { key: 'receipt', icon: ReceiptText },
] as const;

function Step({ index, title, hint, children }: { index: number; title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-start gap-3.5">
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-surface font-mono text-[11px] font-medium text-ink-2 shadow-[0_0_0_1px_var(--border)]">{index}</span>
        <div className="flex flex-col gap-0.5 pt-0.5">
          <h2 className="m-0 text-sm font-medium">{title}</h2>
          {hint && <span className="text-xs text-ink-3">{hint}</span>}
        </div>
      </div>
      <div className="sm:pl-[38px]">{children}</div>
    </section>
  );
}

function PaymentForm({ planId, onPlanChange }: { planId: PlanId; onPlanChange: (id: PlanId) => void }) {
  const t = useTranslations('billing');
  const total = formatSum(PLANS.find((p) => p.id === planId)!.price);

  return (
    <div className="flex w-full max-w-[480px] flex-col gap-8">
      <Step index={1} title={t('choosePeriod')} hint={t('choosePeriodHint')}>
        <PlanPicker value={planId} onChange={onPlanChange} />
      </Step>
      <Step index={2} title={t('paymentMethod')} hint={t('redirect')}>
        <PaymentMethods />
      </Step>
      <div className="flex flex-col gap-3 sm:pl-[38px]">
        <ButtonLink href={ROUTES.billingSuccess} size="md" block icon={<Icon as={Lock} size={14} strokeWidth={2} />} className="h-11 gap-2 rounded-[12px]">
          {t('pay', { amount: total })}
        </ButtonLink>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11.5px] text-ink-3">
          {TRUST.map((item) => (
            <span key={item.key} className="flex items-center gap-1.5">
              <Icon as={item.icon} size={12} strokeWidth={1.8} />
              {t(`trust.${item.key}`)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PromoField() {
  const t = useTranslations('billing');
  return (
    <label className="flex h-9 items-center gap-2 rounded-[10px] bg-surface pr-1 pl-3 text-[13px] shadow-inset focus-within:shadow-focus">
      <Icon as={TagIcon} size={13} className="text-ink-3" />
      <input placeholder={t('promo')} aria-label={t('promo')} className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-ink-disabled" />
      <button type="button" className="flex h-7 items-center rounded-[7px] px-2.5 text-xs font-medium text-ink-body transition-colors hover:bg-hover">{t('apply')}</button>
    </label>
  );
}

function OrderSummary({ planId }: { planId: PlanId }) {
  const t = useTranslations('billing');
  const tp = useTranslations('plans');
  const plan = PLANS.find((p) => p.id === planId)!;
  const full = plan.fullPrice ?? plan.price;
  const saved = full - plan.price;
  const row = 'flex items-center justify-between text-[13px]';

  return (
    <div className="flex w-full max-w-[420px] flex-col gap-6">
      <div className="flex items-start gap-3.5">
        <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-surface shadow-[0_0_0_1px_var(--border),0_4px_10px_-6px_rgba(20,22,30,.2)]">
          <LogoMark size="md" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-sm font-medium">{t('title')}</span>
          <span className="text-xs text-ink-3">{t('product', { plan: tp(`${plan.id}.name`) })}</span>
        </div>
        <span className="font-mono text-sm font-medium">{formatSum(full)}</span>
      </div>

      <div className="flex flex-col gap-3 pt-5 shadow-[0_-1px_0_var(--divider-muted)]">
        <div className={row}>
          <span className="text-ink-2">{t('subtotal')}</span>
          <span className="font-mono">{formatSum(full)}</span>
        </div>
        {saved > 0 && (
          <div className={row}>
            <span className="flex items-center gap-1.5 text-ink-2">
              {t('discount')}
              <span className="rounded-[5px] bg-green-100 px-1.5 text-[10.5px] font-medium text-green-text">−{plan.discount}%</span>
            </span>
            <span className="font-mono text-success">−{formatSum(saved)}</span>
          </div>
        )}
        <PromoField />
      </div>

      <div className="flex flex-col gap-1.5 pt-5 shadow-[0_-1px_0_var(--divider-muted)]">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium">{t('dueToday')}</span>
          <span key={plan.id} className="flex animate-fade-up items-baseline gap-1.5">
            <span className="text-[32px] leading-none font-light tracking-[-0.045em]">{formatSum(plan.price)}</span>
            <span className="text-xs text-ink-3">{tp('currency')}</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-ink-3">
          <span>{t('validUntil')} {t(`validity.${plan.id}`)}</span>
          {saved > 0 && <span className="font-medium text-success">{t('save', { amount: formatSum(saved) })}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-[14px] bg-surface p-4 shadow-[0_0_0_1px_var(--divider-muted)]">
        <span className="text-xs font-medium text-ink-2">{t('included')}</span>
        <ul className="m-0 grid list-none gap-2.5 p-0">
          {PRO_FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-[13px] text-ink-body">
              <span className="grid size-4 shrink-0 place-items-center rounded-full bg-green-100 text-green-text">
                <Icon as={Check} size={10} strokeWidth={3} />
              </span>
              {tp(`features.${f}`)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Checkout() {
  const [planId, setPlanId] = useState<PlanId>(RECOMMENDED_PLAN);

  return (
    <div className={`${panelSurface} grid w-full overflow-hidden lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]`}>
      <div className="flex justify-center px-6 py-8 md:px-10 md:py-12">
        <PaymentForm planId={planId} onPlanChange={setPlanId} />
      </div>
      <div className="relative isolate flex justify-center overflow-hidden bg-surface-muted px-6 py-8 shadow-[inset_0_1px_0_var(--divider-muted)] md:px-10 md:py-12 lg:shadow-[inset_1px_0_0_var(--divider-muted)]">
        <div aria-hidden className="grid-backdrop pointer-events-none absolute inset-0 -z-10 bg-size-[28px_28px] mask-[radial-gradient(ellipse_70%_45%_at_50%_0%,#000,transparent_75%)]" />
        <OrderSummary planId={planId} />
      </div>
    </div>
  );
}
