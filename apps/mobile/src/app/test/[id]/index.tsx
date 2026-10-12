import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, ChevronLeft } from 'lucide-react-native';
import { fetchActiveAttempt, useAttemptStore } from '@/entities/attempt';
import type { AttemptMode } from '@/entities/attempt';
import { sectionOrder, useTest, useTests } from '@/entities/test';
import { ModePicker } from '@/features/test-intro/ui/ModePicker';
import { RulesList } from '@/features/test-intro/ui/RulesList';
import { SectionsCard } from '@/features/test-intro/ui/SectionsCard';
import { TestIntroSkeleton } from '@/features/test-intro/ui/TestIntroSkeleton';
import { TestStats } from '@/features/test-intro/ui/TestStats';
import { beginAttempt } from '@/features/test-session/model/attemptSession';
import { failureReason } from '@/shared/api';
import { useI18n } from '@/shared/i18n';
import { size, space, useTheme } from '@/shared/theme';
import { Button, IconButton, Screen, StateView, Tag, Text, TopBar, useToast } from '@/shared/ui';

const FOOTER_SPACE = size.buttonL + space[6];

export default function TestIntroScreen() {
  const { colors } = useTheme();
  const { t, monthYear } = useI18n();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const test = useTest(id);
  const tests = useTests();
  const local = useAttemptStore((s) => (s.testId === id && s.attemptId ? s.mode : null));
  const showToast = useToast((s) => s.show);
  const [starting, setStarting] = useState(false);
  const [chosen, setChosen] = useState<AttemptMode>('exam');

  const resuming = local !== null || tests.data?.find((item) => item.id === id)?.status === 'in_progress';
  const active = useQuery({
    queryKey: ['attempts', id, 'active'],
    queryFn: () => fetchActiveAttempt(id),
    enabled: resuming && local === null,
  });
  const mode = resuming ? (local ?? active.data?.mode ?? chosen) : chosen;

  const onStart = useCallback(async () => {
    setStarting(true);
    try {
      const { completed } = await beginAttempt(id, mode);
      const next = sectionOrder.find((kind) => !completed.includes(kind)) ?? 'listening';
      router.push({ pathname: '/test/[id]/[section]', params: { id, section: next } });
    } catch (error) {
      showToast({ message: `${t('session.startFailed')} ${t(failureReason(error))}`, tone: 'error' });
    } finally {
      setStarting(false);
    }
  }, [id, mode, showToast, t]);

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
                <Tag label={t(mode === 'exam' ? 'testIntro.examMode' : 'testIntro.practiceMode')} tone="neutral" />
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

            <ModePicker value={mode} locked={resuming} onChange={setChosen} />

            <SectionsCard sections={test.data.sections} />

            <RulesList mode={mode} />
          </>
        ) : test.isError ? (
          <StateView
            tone="error"
            title={t('common.error')}
            message={t(failureReason(test.error))}
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
          loading={starting}
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
