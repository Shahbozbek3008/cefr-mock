'use client';

import { useState } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, DoorOpen, Dumbbell, Headphones, RotateCcw, ShieldCheck, Timer, Wifi, type LucideIcon } from 'lucide-react';
import {
  beginAttempt,
  fetchActiveAttempt,
  sectionOrder,
  useCefrClient,
  useTest,
  useTests,
  type AttemptMode,
} from '@cefr/core';
import { Link, useRouter } from '@/i18n/navigation';
import { ROUTES, SKILLS, SKILL_ICONS } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { useAttemptStore } from '@/lib/attempt-store';
import { failureKey } from '@/lib/exam/session';
import { Icon } from '@/components/ui/icon';
import { Tag } from '@/components/ui/tag';
import { Button } from '@/components/ui/button';
import { RadioDot } from '@/components/ui/controls';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { Panel, panelSurface } from '@/components/dashboard/panel';

const LAYOUT = 'mx-auto grid w-full max-w-[1080px] flex-1 items-start gap-6 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_380px]';
const STATS_GRID = 'grid grid-cols-3 gap-px overflow-hidden rounded-card-sm bg-divider-muted shadow-[0_0_0_1px_rgba(20,22,30,.06)]';
const STAT_CELL = 'flex flex-col gap-0.5 bg-surface px-5 py-4';
const SECTION_ROW = 'grid h-16 grid-cols-[36px_1fr_auto] items-center gap-4 shadow-[0_1px_0_var(--divider)] last:shadow-none';
const SECTION_ICON = 'grid size-9 place-items-center rounded-[10px] bg-surface-sunken text-ink-body';
const SIDE_PANEL = 'flex flex-col gap-5 p-6 lg:sticky lg:top-6';
const MODE_CARD = 'flex items-center gap-3 rounded-[14px] p-3.5';
const RULES_BLOCK = 'flex flex-col gap-2.5 pt-4 shadow-[0_-1px_0_var(--divider)]';
const STAT_LABELS = ['hours', 'sectionsCount', 'score'] as const;

const MODES: { mode: AttemptMode; icon: LucideIcon }[] = [
  { mode: 'exam', icon: ShieldCheck },
  { mode: 'practice', icon: Dumbbell },
];

type RuleKey = 'ruleAudio' | 'ruleNoExit' | 'ruleTimer' | 'ruleOffline' | 'rulePracticeReplay' | 'rulePracticeResume';

const RULES: Record<AttemptMode, { icon: LucideIcon; key: RuleKey }[]> = {
  exam: [
    { icon: Headphones, key: 'ruleAudio' },
    { icon: DoorOpen, key: 'ruleNoExit' },
    { icon: Timer, key: 'ruleTimer' },
    { icon: Wifi, key: 'ruleOffline' },
  ],
  practice: [
    { icon: RotateCcw, key: 'rulePracticeReplay' },
    { icon: DoorOpen, key: 'rulePracticeResume' },
    { icon: Wifi, key: 'ruleOffline' },
  ],
};

function TestIntroSkeleton() {
  const t = useTranslations('exam.testIntro');
  return (
    <div className={LAYOUT}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex gap-1.5">
            <Skeleton className="h-6 w-20 rounded-chip" />
            <Skeleton className="h-6 w-24 rounded-chip" />
          </div>
          <SkeletonText className="w-80 text-[40px] leading-[1.05]" />
          <SkeletonText className="w-56 text-[15px]" />
        </div>
        <div className={STATS_GRID}>
          {STAT_LABELS.map((key) => (
            <div key={key} className={STAT_CELL}>
              <SkeletonText className="w-16 font-mono text-[22px]" />
              <span className="text-xs text-ink-2">{t(key)}</span>
            </div>
          ))}
        </div>
        <Panel>
          <div className="flex flex-col px-5 py-1">
            {SKILLS.map((skill) => (
              <div key={skill} className={SECTION_ROW}>
                <span className={SECTION_ICON}><Icon as={SKILL_ICONS[skill]} size={17} strokeWidth={1.5} /></span>
                <span className="flex flex-col leading-[1.35]">
                  <SkeletonText className="w-24 text-[15px]" />
                  <SkeletonText className="w-40 text-[13px]" />
                </span>
                <SkeletonText className="w-14 text-[13px]" />
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <div className={cn(panelSurface, SIDE_PANEL)}>
        <div className="flex flex-col gap-2.5">
          <span className="text-sm font-medium">{t('mode')}</span>
          {MODES.map(({ mode }) => (
            <div key={mode} className={cn(MODE_CARD, 'bg-surface shadow-inset')}>
              <Skeleton className="size-10 shrink-0 rounded-[11px]" />
              <span className="flex flex-1 flex-col gap-0.5">
                <SkeletonText className="w-28 text-sm" />
                <SkeletonText className="w-full text-xs leading-snug" />
              </span>
            </div>
          ))}
        </div>
        <div className={RULES_BLOCK}>
          <span className="text-sm font-medium">{t('rules')}</span>
          {RULES.exam.map((rule) => <SkeletonText key={rule.key} className="w-4/5 text-[13px] leading-normal" />)}
        </div>
        <Skeleton className="h-11 w-full rounded-[12px]" />
      </div>
    </div>
  );
}

export function TestIntro({ id }: { id: string }) {
  const t = useTranslations('exam');
  const format = useFormatter();
  const client = useCefrClient();
  const router = useRouter();
  const test = useTest(id);
  const tests = useTests();
  const local = useAttemptStore((s) => (s.testId === id && s.attemptId ? s.mode : null));
  const [chosen, setChosen] = useState<AttemptMode>('exam');
  const [starting, setStarting] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const resuming = local !== null || tests.data?.find((item) => item.id === id)?.status === 'in_progress';
  const active = useQuery({ queryKey: ['attempts', id, 'active'], queryFn: () => fetchActiveAttempt(client, id), enabled: resuming && local === null });
  const mode = resuming ? (local ?? active.data?.mode ?? chosen) : chosen;

  const start = async () => {
    setStarting(true);
    setFailure(null);
    try {
      const { completed } = await beginAttempt(client, useAttemptStore, id, mode);
      const next = sectionOrder.find((kind) => !completed.includes(kind)) ?? 'listening';
      router.push(ROUTES.testSection(id, next));
    } catch (error) {
      setFailure(`${t('session.startFailed')} ${t(`common.${failureKey(error)}`)}`);
      setStarting(false);
    }
  };

  const data = test.data;
  const period = data ? format.dateTime(new Date(data.format.year, data.format.month, 1), { month: 'long', year: 'numeric' }) : '';

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-(--test-header-h) items-center bg-surface px-6 shadow-[0_1px_0_rgba(20,22,30,.06)]">
        <Link href={ROUTES.catalog} aria-label={t('common.back')} className="grid size-10 place-items-center rounded-full bg-surface text-ink-body shadow-inset hover:bg-bg-app hover:text-ink">
          <Icon as={ChevronLeft} size={16} strokeWidth={1.7} />
        </Link>
      </header>
      {test.isError ? (
        <div className="grid flex-1 place-items-center px-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <span className="text-sm text-ink-2">{t('testIntro.loadFailed')}. {t(`common.${failureKey(test.error)}`)}</span>
            <Button size="md" onClick={() => test.refetch()}>{t('common.retry')}</Button>
          </div>
        </div>
      ) : !data ? (
        <TestIntroSkeleton />
      ) : (
        <div className={cn('stagger', LAYOUT)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex gap-1.5">
                <Tag>{t('testIntro.fullMock')}</Tag>
                <Tag tone="neutral">{t(mode === 'exam' ? 'testIntro.examMode' : 'testIntro.practiceMode')}</Tag>
              </div>
              <h1 className="m-0 text-[40px] leading-[1.05] font-medium tracking-[-0.045em]">{data.title}</h1>
              <span className="text-[15px] text-ink-2">{t('testIntro.officialFormat', { period })}</span>
            </div>
            <div className={STATS_GRID}>
              {[
                { value: data.durationLabel, label: t('testIntro.hours') },
                { value: String(data.sectionsCount), label: t('testIntro.sectionsCount') },
                { value: data.scoreRange, label: t('testIntro.score') },
              ].map((item) => (
                <div key={item.label} className={STAT_CELL}>
                  <span className="font-mono text-[22px] tracking-[-0.03em]">{item.value}</span>
                  <span className="text-xs text-ink-2">{item.label}</span>
                </div>
              ))}
            </div>
            <Panel>
              <div className="flex flex-col px-5 py-1">
                {data.sections.map((section) => (
                  <div key={section.kind} className={SECTION_ROW}>
                    <span className={SECTION_ICON}><Icon as={SKILL_ICONS[section.kind]} size={17} strokeWidth={1.5} /></span>
                    <span className="flex flex-col leading-[1.35]">
                      <span className="text-[15px] font-medium">{section.title}</span>
                      <span className="text-[13px] text-ink-2">{t(`sections.${section.kind}Detail`, { parts: section.parts, questions: section.questions ?? 0 })}</span>
                    </span>
                    <span className="font-mono text-[13px] text-ink-body">{t(section.approx ? 'units.minutesApprox' : 'units.minutes', { count: section.minutes })}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className={cn(panelSurface, SIDE_PANEL)}>
            <div className="flex flex-col gap-2.5">
              <span className="text-sm font-medium">{t('testIntro.mode')}</span>
              {MODES.filter((item) => !resuming || item.mode === mode).map(({ mode: value, icon }) => {
                const selected = value === mode;
                return (
                  <button
                    key={value}
                    type="button"
                    disabled={resuming}
                    onClick={() => setChosen(value)}
                    data-state={selected ? 'checked' : 'unchecked'}
                    className={cn(
                      MODE_CARD,
                      'group text-left transition-[background-color,box-shadow] duration-(--t-base)',
                      selected ? 'bg-green-50 shadow-[inset_0_0_0_1.5px_var(--green-500)]' : 'bg-surface shadow-inset hover:bg-bg-app',
                    )}
                  >
                    <span className={cn('grid size-10 shrink-0 place-items-center rounded-[11px]', selected ? 'bg-surface text-green-text' : 'bg-surface-sunken text-ink-body')}>
                      <Icon as={icon} size={18} strokeWidth={1.7} />
                    </span>
                    <span className="flex flex-1 flex-col gap-0.5">
                      <span className="text-sm font-medium">{t(value === 'exam' ? 'testIntro.examMode' : 'testIntro.practiceMode')}</span>
                      <span className="text-xs leading-snug text-ink-2">{t(value === 'exam' ? 'testIntro.examModeHint' : 'testIntro.practiceModeHint')}</span>
                    </span>
                    {!resuming && <RadioDot size={18} />}
                  </button>
                );
              })}
              {resuming && <span className="text-xs text-ink-3">{t('testIntro.modeLocked')}</span>}
            </div>
            <div className={RULES_BLOCK}>
              <span className="text-sm font-medium">{t('testIntro.rules')}</span>
              {RULES[mode].map((rule) => (
                <span key={rule.key} className="flex gap-2.5 text-[13px] leading-normal text-ink-body">
                  <Icon as={rule.icon} size={15} className="mt-0.5 shrink-0 text-blue" />
                  {t(`testIntro.${rule.key}`)}
                </span>
              ))}
            </div>
            {failure && <span className="text-[13px] text-error-text">{failure}</span>}
            <Button arrow block size="md" className="h-11 rounded-[12px]" loading={starting} onClick={start}>
              {t(resuming ? 'common.resume' : 'testIntro.start')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
