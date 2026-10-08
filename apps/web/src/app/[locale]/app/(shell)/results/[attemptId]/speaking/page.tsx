import { useTranslations } from 'next-intl';
import { Check, Play } from 'lucide-react';
import { SPEAKING } from '@/lib/mock/ai-feedback';
import { SPEAKING_CRITERIA } from '@/lib/mock/results';
import { initLocale, metadataTitle, type PageProps } from '@/lib/i18n';
import { cn } from '@/lib/cn';
import { Card, Inset } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Gauge, ScoreValue } from '@/components/ui/gauge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Waveform } from '@/components/ui/waveform';
import { BigNumber } from '@/components/ui/typography';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { AppMain } from '@/components/layout/page-header';
import { ResultsHeader } from '@/components/app/results-header';
import { AnnotatedText } from '@/components/app/annotated-text';

export const generateMetadata = metadataTitle('aiSpeaking.title');

const PARTS = ['1.1', '1.2', 'Part 2', 'Part 3'] as const;

function Player() {
  return (
    <Card className="flex items-center gap-[18px] px-[22px] py-[18px] shadow-[0_0_0_1px_rgba(20,22,30,.05)]">
      <button type="button" aria-label="Play" className="shine grid size-12 shrink-0 place-items-center rounded-full bg-action text-white shadow-[0_10px_20px_-10px_oklch(0.45_0.14_140/.7)] transition-[scale] duration-(--t-sheet) ease-spring hover:scale-110 active:scale-95">
        <Play size={15} fill="currentColor" strokeWidth={0} aria-hidden />
      </button>
      <Waveform progress={0.3} className="h-11" />
      <span className="font-mono text-[13px] text-ink-2">{SPEAKING.position} / {SPEAKING.duration}</span>
      <span className="flex h-[30px] items-center rounded-[9px] bg-surface-sunken px-2.5 font-mono text-xs">1.0×</span>
    </Card>
  );
}

function Feedback() {
  const t = useTranslations('aiSpeaking.feedback');
  return (
    <Card className="flex flex-col gap-2.5 px-5 py-[18px] shadow-[0_0_0_1px_rgba(20,22,30,.05)]">
      {SPEAKING.feedback.map((f) => (
        <div key={f.key} className="flex items-start gap-2.5">
          <span className={cn('grid size-[22px] shrink-0 place-items-center rounded-full text-xs font-semibold', f.tone === 'success' ? 'bg-success-50 text-success' : 'bg-warning-50 text-warning-text')}>
            {f.tone === 'success' ? <Icon as={Check} size={12} strokeWidth={2.5} /> : '!'}
          </span>
          <span className="text-sm leading-normal text-ink-body">{t(f.key)}</span>
        </div>
      ))}
    </Card>
  );
}

function AiSpeakingView() {
  const t = useTranslations('aiSpeaking');
  return (
    <AppMain className="gap-5 overflow-hidden">
      <ResultsHeader
        crumb="Speaking"
        title={t('title')}
        actions={<SegmentedControl label={t('title')} defaultValue="1.2" className="w-80" options={PARTS.map((p) => ({ value: p, label: p }))} />}
      />
      <div className="grid flex-1 gap-4 xl:grid-cols-[1fr_420px]">
        <div className="flex flex-col gap-3">
          <Player />
          <Card className="flex flex-1 flex-col gap-4 px-7 py-6 shadow-[0_0_0_1px_rgba(20,22,30,.05)]">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-medium">{t('transcript')}</span>
              <span className="font-mono text-xs text-ink-3">{t('stats', SPEAKING.stats)}</span>
            </div>
            <p className="m-0 max-w-[760px] text-lg leading-[1.9] text-ink-reading">
              <span className="mr-2 font-mono text-[11px] text-ink-3">0:00</span>
              <AnnotatedText segments={SPEAKING.transcript} />
            </p>
          </Card>
        </div>
        <div className="stagger flex flex-col gap-3">
          <Card elevation="e1" className="flex items-center gap-[18px] px-5 py-[18px]">
            <Gauge value={SPEAKING.score} max={SPEAKING.max} size={110} stroke={12} labelOffset={11}>
              <ScoreValue value={SPEAKING.score} max={SPEAKING.max} size={33} />
            </Gauge>
            <div className="flex flex-col gap-1">
              <span className="text-[13px] text-ink-2">{t('partScore', { part: SPEAKING.part })}</span>
              <span className="text-lg font-medium">{t('level')}</span>
              <span className="text-[13px] text-ink-2">{t.rich('overall', { score: SPEAKING.total, mono: (c) => <span className="font-mono text-ink">{c}</span> })}</span>
            </div>
          </Card>
          <div className="stagger grid grid-cols-2 gap-2">
            {SPEAKING_CRITERIA.map((c) => (
              <Inset key={c.name} className="flex flex-col gap-2.5 rounded-card-sm p-4">
                <span className="text-[13px] text-ink-2">{c.name}</span>
                <BigNumber value={c.score} max={`/${c.max}`} size={30} className="tracking-[-0.05em] [&>span]:ml-[3px] [&>span]:text-[11px]" />
                <ProgressBar value={c.score} max={c.max} size="xs" tone={'tone' in c ? c.tone : 'blue'} />
              </Inset>
            ))}
          </div>
          <Feedback />
        </div>
      </div>
    </AppMain>
  );
}

export default async function AiSpeakingPage({ params }: PageProps<{ attemptId: string }>) {
  await initLocale(params);
  return <AiSpeakingView />;
}
