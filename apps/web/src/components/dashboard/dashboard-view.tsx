'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import {
  DEFAULT_DAILY_MINUTES,
  dayKey,
  daysUntil,
  streakOf,
  todayPlanOf,
  useProfile,
  useResults,
  useStudyDays,
  useTests,
  weekDays,
  weekdayIndex,
  weeklyPlan,
  type SectionScores,
  type TestSummary,
} from '@cefr/core';
import { AppMain } from '@/components/layout/page-header';
import { KpiCards, type KpiData } from './kpi-cards';
import { ScoreChart } from './score-chart';
import { ContinueCard } from './continue-card';
import { InsightCard } from './insight-card';
import { SkillsCard, type SkillScore } from './skills-card';
import { ActivityCard } from './activity-card';
import { TodayPlan } from './today-plan';
import { RecommendedTable } from './recommended-table';

const TREND_LENGTH = 8;
const RECOMMENDED_LIMIT = 5;
const STATUS_RANK: Record<TestSummary['status'], number> = { in_progress: 0, new: 1, completed: 2, locked: 3 };

const noop = () => () => undefined;

const useToday = () => {
  const key = useSyncExternalStore(noop, () => dayKey(new Date()), () => null);
  return useMemo(() => (key ? new Date(`${key}T12:00:00`) : null), [key]);
};

export function DashboardView() {
  const t = useTranslations('dashboard');
  const weekdays = useTranslations('calendar')('weekdays').split(',');
  const format = useFormatter();
  const today = useToday();
  const profile = useProfile().data;
  const results = useResults().data ?? [];
  const tests = useTests().data ?? [];
  const minutesByDay = useStudyDays().data ?? {};

  const latest = results[0];
  const goal = profile?.dailyMinutes ?? DEFAULT_DAILY_MINUTES;
  const todayIndex = today ? weekdayIndex(today) : -1;
  const week = (today ? weekDays(today) : []).map((key, i) => ({ key, label: weekdays[i], minutes: minutesByDay[key] ?? 0 }));
  const studiedToday = today ? (minutesByDay[dayKey(today)] ?? 0) : 0;
  const daysLeft = profile?.examDate ? daysUntil(profile.examDate) : null;

  const kpi: KpiData = {
    score: latest?.total ?? null,
    delta: latest?.delta ?? 0,
    trend: results.slice(0, TREND_LENGTH).map((r) => r.total).reverse(),
    daysLeft,
    examLabel: profile?.examDate ? format.dateTime(new Date(`${profile.examDate}T00:00:00`), { day: 'numeric', month: 'long' }) : null,
    target: profile?.targetLevel ?? null,
    streak: today ? streakOf(minutesByDay, today) : 0,
    week,
    weekGoal: goal * 7,
  };

  const scores: SectionScores = Object.fromEntries(latest?.sections.map((s) => [s.kind, s.score]) ?? []);
  const plan = today ? todayPlanOf(weeklyPlan(scores)[todayIndex], goal, studiedToday) : [];
  const skills: SkillScore[] = latest?.sections.map((s) => ({ skill: s.kind, score: s.score, delta: s.delta, weak: s.focus })) ?? [];
  const resume = tests.find((test) => test.status === 'in_progress');
  const recommended = tests
    .filter((test) => test.status !== 'locked')
    .sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status])
    .slice(0, RECOMMENDED_LIMIT);

  return (
    <AppMain className="gap-5">
      <div className="flex flex-col gap-1 pb-1">
        <span className="min-h-5 text-[13px] text-ink-3">{today && format.dateTime(today, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        <h1 className="m-0 text-[26px] leading-tight font-medium tracking-[-0.035em]">{t('greeting', { name: profile?.firstName ?? '' })}</h1>
        <p className="m-0 text-sm text-ink-2">{daysLeft === null ? t('subtitleNoExam') : t('subtitle', { days: daysLeft })}</p>
      </div>
      <KpiCards data={kpi} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <ScoreChart />
        <div className="flex flex-col gap-4">
          <ContinueCard test={resume} />
          <InsightCard latest={latest} />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <SkillsCard skills={skills} title={t('skills.title')} subtitle={t('skills.subtitle')} />
        <ActivityCard week={week} todayIndex={todayIndex} goal={goal} />
        <TodayPlan items={plan} studied={studiedToday} />
      </div>
      <RecommendedTable tests={recommended} />
    </AppMain>
  );
}
