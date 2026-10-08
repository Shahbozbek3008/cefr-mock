import { useTranslations } from 'next-intl';
import { MOCK_EXAM, MOCK_USER } from '@/lib/mock/user';
import { DASHBOARD_SKILLS } from '@/lib/mock/results';
import { initLocale, metadataTitle, type LocaleParams } from '@/lib/i18n';
import { AppMain } from '@/components/layout/page-header';
import { KpiCards } from '@/components/dashboard/kpi-cards';
import { ScoreChart } from '@/components/dashboard/score-chart';
import { ContinueCard } from '@/components/dashboard/continue-card';
import { InsightCard } from '@/components/dashboard/insight-card';
import { SkillsCard } from '@/components/dashboard/skills-card';
import { ActivityCard } from '@/components/dashboard/activity-card';
import { TodayPlan } from '@/components/dashboard/today-plan';
import { RecommendedTable } from '@/components/dashboard/recommended-table';

export const generateMetadata = metadataTitle('dashboard.metaTitle');

function DashboardView() {
  const t = useTranslations('dashboard');
  return (
    <AppMain className="gap-5">
      <div className="flex flex-col gap-1 pb-1">
        <span className="text-[13px] text-ink-3">{t('today')}</span>
        <h1 className="m-0 text-[26px] leading-tight font-medium tracking-[-0.035em]">{t('greeting', { name: MOCK_USER.firstName })}</h1>
        <p className="m-0 text-sm text-ink-2">{t('subtitle', { days: MOCK_EXAM.daysLeft })}</p>
      </div>
      <KpiCards />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <ScoreChart />
        <div className="flex flex-col gap-4">
          <ContinueCard />
          <InsightCard />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <SkillsCard skills={DASHBOARD_SKILLS} title={t('skills.title')} subtitle={t('skills.subtitle')} />
        <ActivityCard />
        <TodayPlan />
      </div>
      <RecommendedTable />
    </AppMain>
  );
}

export default async function DashboardPage({ params }: { params: LocaleParams }) {
  await initLocale(params);
  return <DashboardView />;
}
