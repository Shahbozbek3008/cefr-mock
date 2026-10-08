import { ComponentType, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useAttemptStore } from '@/entities/attempt';
import { sectionOrder, useTest } from '@/entities/test';
import type { SectionKind, TestDetail } from '@/entities/test';
import { useAttemptAutosave, useAttemptSession } from '@/features/test-session/model/attemptSession';
import { SectionSkeleton } from '@/features/test-session/ui/SectionSkeleton';
import { failureReason } from '@/shared/api';
import { useI18n } from '@/shared/i18n';
import { space } from '@/shared/theme';
import { Screen, StateView } from '@/shared/ui';
import { ListeningSection } from '@/widgets/listening-section/ListeningSection';
import { ReadingSection } from '@/widgets/reading-section/ReadingSection';
import { SpeakingSection } from '@/widgets/speaking-section/SpeakingSection';
import { WritingSection } from '@/widgets/writing-section/WritingSection';

const sections: Record<SectionKind, ComponentType<{ test: TestDetail }>> = {
  listening: ListeningSection,
  reading: ReadingSection,
  writing: WritingSection,
  speaking: SpeakingSection,
};

const isSection = (value: string | undefined): value is SectionKind => sectionOrder.includes(value as SectionKind);

export default function SectionScreen() {
  const { id, section } = useLocalSearchParams<{ id: string; section: string }>();
  const test = useTest(id);
  const { t } = useI18n();
  const session = useAttemptSession(id);
  const enterSection = useAttemptStore((s) => s.enterSection);
  const minutes = test.data?.sections.find((s) => s.kind === section)?.minutes;
  const ready = session.status === 'ready' && test.data !== undefined;

  useAttemptAutosave(ready);

  useEffect(() => {
    if (!ready || !isSection(section) || minutes === undefined) return;
    enterSection(section, minutes * 60);
  }, [enterSection, minutes, ready, section]);

  if (!isSection(section)) return <Redirect href={{ pathname: '/test/[id]', params: { id } }} />;

  if (!ready || !test.data) {
    const failed = test.isError || session.status === 'error';
    return (
      <Screen>
        <View style={styles.loading}>
          {failed ? (
            <StateView
              tone="error"
              title={t('common.error')}
              message={`${t(test.isError ? 'testIntro.loadFailed' : 'session.startFailed')} ${t(failureReason(test.error ?? session.error))}`}
              actionLabel={t('common.retry')}
              onAction={() => (test.isError ? test.refetch() : session.retry())}
            />
          ) : (
            <SectionSkeleton />
          )}
        </View>
      </Screen>
    );
  }

  const Section = sections[section];
  return <Section key={section} test={test.data} />;
}

const styles = StyleSheet.create({
  loading: {
    gap: space[3],
  },
});
