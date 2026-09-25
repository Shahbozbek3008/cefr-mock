import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, ChevronLeft } from 'lucide-react-native';
import { useAttemptStore } from '@/entities/attempt';
import { sectionOrder, useTest } from '@/entities/test';
import { RulesList } from '@/features/test-intro/ui/RulesList';
import { SectionsCard } from '@/features/test-intro/ui/SectionsCard';
import { TestStats } from '@/features/test-intro/ui/TestStats';
import { TestIntroSkeleton } from '@/features/test-intro/ui/TestIntroSkeleton';
import { useI18n } from '@/shared/i18n';
import { size, space, useTheme } from '@/shared/theme';
import { Button, IconButton, Screen, StateView, Tag, Text, TopBar } from '@/shared/ui';

const FOOTER_SPACE = size.buttonL + space[6];

export default function TestIntroScreen() {
  const { colors } = useTheme();
  const { t, monthYear } = useI18n();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const test = useTest(id);
  const attemptTestId = useAttemptStore((s) => s.testId);
  const start = useAttemptStore((s) => s.start);

  const resuming = attemptTestId === id;

  const onStart = useCallback(() => {
    start(id);
    const next = sectionOrder.find((kind) => !useAttemptStore.getState().completed.includes(kind)) ?? 'listening';
    router.push({ pathname: '/test/[id]/[section]', params: { id, section: next } });
  }, [id, start]);

  return (
    <Screen>
      <TopBar
        left={
          <IconButton accessibilityLabel={t('common.back')} onPress={router.back}>
            <ChevronLeft size={17} color={colors.textStrong} strokeWidth={1.6} />
          </IconButton>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + FOOTER_SPACE + space[4] }]}
        showsVerticalScrollIndicator={false}
      >
        {test.data ? (
          <>
            <View style={styles.intro}>
              <View style={styles.tags}>
                <Tag label={t('testIntro.fullMock')} tone="lime" />
                <Tag label={t('testIntro.realMode')} tone="neutral" />
              </View>
              <Text variant="titleXl">{test.data.title}</Text>
              <Text variant="bodySm" color={colors.textSecondary}>
                {t('testIntro.officialFormat', { period: monthYear(test.data.format.month, test.data.format.year) })}
              </Text>
            </View>

            <TestStats
              items={[
                { value: test.data.durationLabel, label: t('testIntro.hours') },
                { value: String(test.data.sectionsCount), label: t('testIntro.sectionsCount') },
                { value: test.data.scoreRange, label: t('testIntro.score') },
              ]}
            />

            <SectionsCard sections={test.data.sections} />

            <RulesList />
          </>
        ) : test.isError ? (
          <StateView
            tone="error"
            title={t('common.error')}
            message={t('common.checkInternet')}
            actionLabel={t('common.retry')}
            onAction={() => test.refetch()}
          />
        ) : (
          <TestIntroSkeleton />
        )}
      </ScrollView>

      <View style={[styles.footer, { bottom: insets.bottom + space[3] }]}>
        <Button
          label={t(resuming ? 'common.resume' : 'testIntro.start')}
          disabled={!test.data}
          onPress={onStart}
          trailingIcon={
            <ArrowRight size={18} color={test.data ? colors.onAction : colors.disabledText} strokeWidth={1.75} />
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: space[4.5],
    gap: space[4.5],
  },
  intro: {
    gap: space[2],
    paddingHorizontal: space[1],
  },
  tags: {
    flexDirection: 'row',
    gap: space[1.5],
  },
  footer: {
    position: 'absolute',
    left: size.screenPadding,
    right: size.screenPadding,
  },
});
