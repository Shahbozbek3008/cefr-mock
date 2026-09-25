import { ComponentType, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useAttemptStore } from '@/entities/attempt';
import { sectionOrder, useTest } from '@/entities/test';
import type { SectionKind, TestDetail } from '@/entities/test';
import { useI18n } from '@/shared/i18n';
import { space } from '@/shared/theme';
import { Screen, SkeletonCard, StateView } from '@/shared/ui';
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
  const start = useAttemptStore((s) => s.start);
  const enterSection = useAttemptStore((s) => s.enterSection);
  const minutes = test.data?.sections.find((s) => s.kind === section)?.minutes;

  useEffect(() => {
    if (!isSection(section) || minutes === undefined) return;
    start(id);
    enterSection(section, minutes * 60);
  }, [enterSection, id, minutes, section, start]);

  if (!isSection(section)) return <Redirect href={{ pathname: '/test/[id]', params: { id } }} />;

  if (!test.data) {
    return (
      <Screen>
        <View style={styles.loading}>
          {test.isError ? (
            <StateView
              tone="error"
              title={t('common.error')}
              message={t('testIntro.loadFailed')}
              actionLabel={t('common.retry')}
              onAction={() => test.refetch()}
            />
          ) : (
            <>
              <SkeletonCard lines={4} />
              <SkeletonCard lines={3} />
            </>
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
    paddingTop: space[12],
    gap: space[3],
  },
});
