import { useTranslations } from 'next-intl';
import { Download, Share } from 'lucide-react';
import { LEVELS, MAX_SCORE, ROUTES } from '@/lib/constants';
import { LATEST_RESULT, WRITING_CRITERIA } from '@/lib/mock/results';
import { initLocale, metadataTitle, type PageProps } from '@/lib/i18n';
import { Card } from '@/components/ui/card';
import { Tag } from '@/components/ui/tag';
import { Icon } from '@/components/ui/icon';
import { Gauge, ScoreValue } from '@/components/ui/gauge';
import { Button, ButtonLink } from '@/components/ui/button';
import { AiLabel } from '@/components/ui/ai-tip';
import { Breadcrumb } from '@/components/ui/typography';
import { AppMain, PageHeader } from '@/components/layout/page-header';
import { ScaleBar, LEVEL_LABELS } from '@/components/app/scale-bar';
import { SkillStatCard } from '@/components/app/skill-stat-card';

export const generateMetadata = metadataTitle('results.metaTitle');

const SKILL_HREF = {
  listening: ROUTES.review(LATEST_RESULT.attemptId),
  reading: ROUTES.review(LATEST_RESULT.attemptId),
  writing: ROUTES.aiWriting(LATEST_RESULT.attemptId),
  speaking: ROUTES.aiSpeaking(LATEST_RESULT.attemptId),
} as const;

const [grammar, coherence] = [WRITING_CRITERIA[3], WRITING_CRITERIA[1]];
const nextLevel = LEVELS.find((l) => l.min > LATEST_RESULT.total)!;

function ScoreCard() {
  const t = useTranslations('results.score');
  return (
    <Card elevation="e1" className="flex flex-col items-center gap-[14px] p-7">
      <Gauge value={LATEST_RESULT.total} max={MAX_SCORE} size={220} stroke={12} labelOffset={22}>
        <ScoreValue value={LATEST_RESULT.total} max={MAX_SCORE} size={66} />
      </Gauge>
      <Tag size="lg" className="animate-pop [animation-delay:900ms]">{t('level')}</Tag>
      <div className="w-full pt-[14px]">
        <ScaleBar value={LATEST_RESULT.total} variant="light" labels={LEVEL_LABELS} />
      </div>
      <span className="pt-1.5 text-sm text-ink-2">
        {t.rich('toNext', {
          level: nextLevel.code,
          points: nextLevel.min - LATEST_RESULT.total,
          delta: LATEST_RESULT.delta,
          mono: (c) => <span className="font-mono text-ink">{c}</span>,
          up: (c) => <span className="font-mono text-success">{c}</span>,
        })}
      </span>
    </Card>
  );
}

function AiRecommendation() {
  const t = useTranslations('results.recommendation');
  const focus = [
    { title: grammar.name, text: t('grammar', { score: grammar.score, max: grammar.max }) },
    { title: coherence.name, text: t('coherence', { score: coherence.score, max: coherence.max }) },
    { title: 'Task 1', text: t('task1') },
  ];
  return (
    <Card className="grid items-center gap-7 px-6 py-[22px] shadow-[0_0_0_1px_rgba(20,22,30,.05)] xl:grid-cols-[260px_1fr_auto]">
      <div className="flex flex-col gap-1.5">
        <AiLabel>{t('label')}</AiLabel>
        <span className="text-lg leading-[1.3] font-medium tracking-[-0.02em]">{t('title')}</span>
      </div>
      <div className="stagger grid grid-cols-3 gap-2.5">
        {focus.map((f) => (
          <div key={f.title} className="flex flex-col gap-0.5 rounded-[14px] bg-surface-muted px-[14px] py-3 transition-[background-color,box-shadow,translate] duration-(--t-base) ease-out-expo hover:-translate-y-0.5 hover:bg-surface hover:shadow-e1">
            <span className="text-sm font-medium">{f.title}</span>
            <span className="text-xs text-ink-2">{f.text}</span>
          </div>
        ))}
      </div>
      <ButtonLink href={ROUTES.testSection('13', 'writing')} size="md" arrow>{t('cta')}</ButtonLink>
    </Card>
  );
}

function ResultView() {
  const t = useTranslations('results');
  return (
    <AppMain className="gap-5 overflow-hidden">
      <PageHeader
        meta={<Breadcrumb items={[t('breadcrumbTests'), t('breadcrumbAttempt', { name: LATEST_RESULT.testName, date: t('attemptDate') })]} />}
        title={t('title', { name: LATEST_RESULT.testName })}
        actions={
          <>
            <Button variant="secondary" size="sm" icon={<Icon as={Share} size={16} />}>{t('share')}</Button>
            <Button variant="secondary" size="sm" icon={<Icon as={Download} size={16} />}>PDF</Button>
            <ButtonLink href={ROUTES.review(LATEST_RESULT.attemptId)} size="sm" arrow className="px-[18px]">{t('detailed')}</ButtonLink>
          </>
        }
      />
      <div className="grid gap-4 xl:grid-cols-[400px_1fr]">
        <ScoreCard />
        <div className="stagger grid grid-cols-2 gap-3">
          {LATEST_RESULT.skills.map((s) => <SkillStatCard key={s.skill} {...s} variant="detailed" href={SKILL_HREF[s.skill]} />)}
        </div>
      </div>
      <AiRecommendation />
    </AppMain>
  );
}

export default async function ResultPage({ params }: PageProps<{ attemptId: string }>) {
  await initLocale(params);
  return <ResultView />;
}
