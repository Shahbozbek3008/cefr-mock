'use client';

import { useState, type FormEvent } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import {
  DAILY_MINUTES,
  PHONE_DIGITS,
  fetchProfile,
  formatPhone,
  isPhoneComplete,
  onboardingPatch,
  profileKeys,
  requestCode,
  sanitizeDigits,
  studyPlanOf,
  updateProfile,
  useCefrClient,
  type DailyMinutes,
  type TargetLevel,
} from '@cefr/core';
import { useRouter } from '@/i18n/navigation';
import { LEVELS, ROUTES } from '@/lib/constants';
import { richTags } from '@/lib/rich';
import { useOnboardingHydrated, useOnboardingStore } from '@/lib/onboarding-store';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tag } from '@/components/ui/tag';
import { AiTip } from '@/components/ui/ai-tip';
import { StatGrid } from '@/components/ui/stat-grid';
import { Checkbox } from '@/components/ui/controls';
import { KeyValueList } from '@/components/ui/key-value-list';
import { SuccessBadge } from '@/components/ui/success-badge';
import { Field, PhoneInput, TextInput } from '@/components/ui/field';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { NextTestLink } from '@/components/exam/next-test-link';
import { authErrorKey } from './auth-error';
import { ExamCalendar } from './exam-calendar';
import { LevelPicker } from './level-picker';
import { OnboardingSplit } from './onboarding-split';
import { SocialButtons } from './social-buttons';
import { VerifyCodeForm } from './verify-code-form';

const levelOf = (code: TargetLevel | null) => LEVELS.find((level) => level.code === code);

const useExamLabel = () => {
  const format = useFormatter();
  return (iso: string) => format.dateTime(new Date(`${iso}T00:00:00`), { day: 'numeric', month: 'long', year: 'numeric' });
};

export function GoalStep() {
  const t = useTranslations('onboarding');
  const router = useRouter();
  useOnboardingHydrated();
  const targetLevel = useOnboardingStore((s) => s.targetLevel);
  const setTargetLevel = useOnboardingStore((s) => s.setTargetLevel);

  return (
    <>
      <LevelPicker value={targetLevel} onChange={(value) => setTargetLevel(value as TargetLevel)} />
      <div className="flex w-full max-w-[748px] justify-end">
        <Button arrow disabled={!targetLevel} onClick={() => router.push(ROUTES.startDate)} className="min-w-[220px] max-sm:w-full">
          {t('continue')}
        </Button>
      </div>
    </>
  );
}

export function DateStep() {
  const t = useTranslations('onboarding');
  const hydrated = useOnboardingHydrated();
  const { targetLevel, examDate, dailyMinutes, setExamDate, setDailyMinutes } = useOnboardingStore();
  const plan = studyPlanOf(examDate);
  const target = levelOf(targetLevel);

  return (
    <OnboardingSplit
      title={t('date.title')}
      text={t('date.text')}
      aside={<ExamCalendar key={String(hydrated)} value={examDate} onChange={setExamDate} />}
    >
      <div className="flex flex-col gap-2.5">
        <span className="text-[13px] font-medium">{t('date.daily')}</span>
        <SegmentedControl
          size="lg"
          label={t('date.daily')}
          value={String(dailyMinutes)}
          onValueChange={(value) => setDailyMinutes(Number(value) as DailyMinutes)}
          options={DAILY_MINUTES.map((m) => ({ value: String(m), label: t('date.options.minutes', { count: m }) }))}
        />
      </div>
      <Card radius="md" className="flex items-center gap-4 rounded-[14px] px-4 py-3.5">
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-xs text-ink-2">{t('date.planLabel')}</span>
          <span className="text-[15px] font-medium">{plan ? t('date.planValue', { days: plan.days, tests: plan.tests }) : t('date.planEmpty')}</span>
        </div>
        {target && <Tag className="h-[26px] rounded-[9px] px-2.5 font-mono font-normal">{t('date.target', { level: target.code, min: target.min })}</Tag>}
      </Card>
      <div className="flex flex-col gap-1.5">
        <ButtonLink href={ROUTES.startAccount} size="md" arrow block className="h-11 rounded-[12px]">{t('continue')}</ButtonLink>
        {examDate && (
          <button type="button" onClick={() => setExamDate(null)} className="h-10 text-[13px] font-medium text-ink-2 hover:text-ink">
            {t('date.skip')}
          </button>
        )}
      </div>
    </OnboardingSplit>
  );
}

function PlanSummary() {
  const t = useTranslations('onboarding.account.summary');
  const examLabel = useExamLabel();
  const { targetLevel, examDate, dailyMinutes } = useOnboardingStore();
  const target = levelOf(targetLevel);
  const plan = studyPlanOf(examDate);

  return (
    <div className="flex flex-col gap-[18px] rounded-card bg-surface p-6 shadow-[0_0_0_1px_rgba(20,22,30,.06),0_30px_60px_-30px_rgba(20,22,30,.18)]">
      <span className="text-[13px] text-ink-2">{t('title')}</span>
      <KeyValueList
        items={[
          { label: t('goal'), value: target ? t('goalValue', { level: target.code, min: target.min }) : t('empty') },
          { label: t('exam'), value: examDate && plan ? t('examValue', { date: examLabel(examDate), days: plan.days }) : t('empty') },
          { label: t('daily'), value: t('dailyValue', { minutes: dailyMinutes }) },
          { label: t('plan'), value: plan ? t('planValue', { tests: plan.tests, drills: plan.drills }) : t('planFlexible') },
        ]}
      />
      <AiTip>{t('tip')}</AiTip>
    </div>
  );
}

export function AccountStep() {
  const t = useTranslations('onboarding.account');
  const ta = useTranslations('auth');
  const client = useCefrClient();
  const router = useRouter();
  const hydrated = useOnboardingHydrated();
  const stored = useOnboardingStore();
  const [firstName, setFirstName] = useState('');
  const [digits, setDigits] = useState('');
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<ReturnType<typeof authErrorKey> | null>(null);
  const [seeded, setSeeded] = useState(false);

  if (hydrated && !seeded) {
    setSeeded(true);
    setFirstName(stored.firstName);
    setDigits(stored.phone);
  }

  const valid = firstName.trim().length > 0 && isPhoneComplete(digits) && consent;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!valid || pending) return;
    setPending(true);
    setError(null);
    try {
      await requestCode(client, digits);
      stored.setAccount(firstName.trim(), digits);
      router.push(`${ROUTES.startVerify}?phone=${digits}`);
    } catch (failure) {
      setError(authErrorKey(failure));
      setPending(false);
    }
  };

  return (
    <OnboardingSplit title={t('title')} text={t('text')} aside={<PlanSummary />}>
      <form onSubmit={submit} className="flex flex-col gap-7">
        <Field label={t('name')} htmlFor="name">
          <TextInput id="name" name="name" autoComplete="given-name" maxLength={40} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </Field>
        <Field label={ta('phone')} htmlFor="phone" hint={error ? <span className="text-error-text">{ta(`errors.${error}`)}</span> : t('smsHint')}>
          <PhoneInput id="phone" name="phone" placeholder="90 123 45 67" value={formatPhone(digits)} onChange={(e) => setDigits(sanitizeDigits(e.target.value, PHONE_DIGITS))} />
        </Field>
        <Checkbox id="consent" checked={consent} onCheckedChange={setConsent}>
          {t.rich('consent', { terms: (c) => <a href="#">{c}</a>, privacy: (c) => <a href="#">{c}</a> })}
        </Checkbox>
        <Button type="submit" size="md" arrow block disabled={!valid} loading={pending} className="h-11 rounded-[12px]">{ta('sendCode')}</Button>
      </form>
      <SocialButtons />
    </OnboardingSplit>
  );
}

type Summary = { days: number | null; tests: number | null; minutes: number };

function DoneCard({ digits, summary }: { digits: string; summary: Summary }) {
  const t = useTranslations('onboarding.done');
  return (
    <>
      <SuccessBadge />
      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-[28px] font-medium tracking-[-0.04em]">{t('title')}</h1>
        <p className="m-0 text-[15px] leading-[1.55] text-ink-2">{t.rich('text', { ...richTags, phone: `+998 ${formatPhone(digits)}` })}</p>
      </div>
      <StatGrid
        stats={[
          { value: summary.days ?? '—', label: t('stats.days') },
          { value: summary.tests ?? '—', label: t('stats.tests') },
          { value: summary.minutes, label: t('stats.minutes') },
        ]}
      />
      <div className="flex flex-col gap-2">
        <NextTestLink arrow block>{t('startFree')}</NextTestLink>
        <ButtonLink href={ROUTES.dashboard} variant="secondary" block className="h-12">{t('toDashboard')}</ButtonLink>
      </div>
    </>
  );
}

export function VerifyStep({ digits }: { digits: string }) {
  const t = useTranslations('auth');
  const client = useCefrClient();
  const queryClient = useQueryClient();
  useOnboardingHydrated();
  const [summary, setSummary] = useState<Summary | null>(null);

  const finish = async () => {
    const draft = useOnboardingStore.getState();
    const profile = await fetchProfile(client);
    await updateProfile(client, onboardingPatch(profile, draft)).catch(() => undefined);
    const plan = studyPlanOf(profile.examDate ?? draft.examDate);
    setSummary({ days: plan?.days ?? null, tests: plan?.tests ?? null, minutes: profile.dailyMinutes ?? draft.dailyMinutes });
    draft.reset();
    queryClient.invalidateQueries({ queryKey: profileKeys.me });
  };

  if (summary) return <DoneCard digits={digits} summary={summary} />;

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-[28px] font-medium tracking-[-0.04em]">{t('verify.title')}</h1>
        <p className="m-0 text-[15px] leading-[1.55] text-ink-2">{t.rich('verify.text', { ...richTags, phone: `+998 ${formatPhone(digits)}` })}</p>
      </div>
      <VerifyCodeForm digits={digits} onVerified={finish} />
    </>
  );
}
