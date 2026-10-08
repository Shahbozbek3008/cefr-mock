'use client';

import { useEffect, type ComponentType } from 'react';
import { useTranslations } from 'next-intl';
import { sectionOrder, useAttemptAutosave, useAttemptSession, useTest, type AttemptScope, type SectionKind, type TestDetail } from '@cefr/core';
import { useRouter } from '@/i18n/navigation';
import { ROUTES } from '@/lib/constants';
import { useAttemptStore } from '@/lib/attempt-store';
import { failureKey } from '@/lib/exam/session';
import { Button } from '@/components/ui/button';
import { ListeningSection } from './listening-section';
import { ReadingSection } from './reading-section';
import { WritingSection } from './writing-section';
import { SpeakingSection } from './speaking-section';

const SECTIONS: Record<SectionKind, ComponentType<{ test: TestDetail }>> = {
  listening: ListeningSection,
  reading: ReadingSection,
  writing: WritingSection,
  speaking: SpeakingSection,
};

function ScreenState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const t = useTranslations('exam.common');
  return (
    <div className="grid flex-1 place-items-center px-6">
      {message ? (
        <div className="flex max-w-[380px] flex-col items-center gap-4 text-center">
          <span className="text-lg font-medium">{t('error')}</span>
          <span className="text-sm text-ink-2">{message}</span>
          {onRetry && <Button size="md" onClick={onRetry}>{t('retry')}</Button>}
        </div>
      ) : (
        <span className="size-8 animate-spin rounded-full border-2 border-line border-t-green" aria-label={t('loading')} />
      )}
    </div>
  );
}

export function ExamSectionScreen({ id, section, scope }: { id: string; section: SectionKind; scope: AttemptScope }) {
  const t = useTranslations('exam');
  const router = useRouter();
  const test = useTest(id);
  const session = useAttemptSession(useAttemptStore, id, scope);
  const enterSection = useAttemptStore((s) => s.enterSection);
  const completed = useAttemptStore((s) => s.completed);
  const minutes = test.data?.sections.find((s) => s.kind === section)?.minutes;
  const ready = session.status === 'ready' && test.data !== undefined;
  const allowed = scope === 'full' ? sectionOrder.find((kind) => !completed.includes(kind)) : scope;
  const locked = ready && allowed !== section;

  useAttemptAutosave(useAttemptStore, ready && !locked);

  useEffect(() => {
    if (!locked) return;
    router.replace(allowed ? ROUTES.testSection(id, allowed) : ROUTES.test(id));
  }, [allowed, id, locked, router]);

  useEffect(() => {
    if (!ready || locked || minutes === undefined) return;
    enterSection(section, minutes * 60);
  }, [enterSection, locked, minutes, ready, section]);

  if (test.isError) return <ScreenState message={`${t('testIntro.loadFailed')}. ${t(`common.${failureKey(test.error)}`)}`} onRetry={() => test.refetch()} />;
  if (session.status === 'error') return <ScreenState message={`${t('session.startFailed')} ${t(`common.${failureKey(session.error)}`)}`} onRetry={session.retry} />;
  if (!ready || !test.data || locked) return <ScreenState />;

  const Section = SECTIONS[section];
  return <Section key={section} test={test.data} />;
}
