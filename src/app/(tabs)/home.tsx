import { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLatestResult } from '@/entities/result';
import { useTests } from '@/entities/test';
import { useUserStore } from '@/entities/user/model';
import { todayPlan } from '@/features/home/model/plan';
import type { PlanItem } from '@/features/home/model/plan';
import { ContinueCard } from '@/features/home/ui/ContinueCard';
import { ExamHero } from '@/features/home/ui/ExamHero';
import { HomeHeader } from '@/features/home/ui/HomeHeader';
import { SectionsOverview } from '@/features/home/ui/SectionsOverview';
import { TodayPlan } from '@/features/home/ui/TodayPlan';
import { daysUntil } from '@/shared/lib';
import { light, size, space } from '@/shared/theme';
import { SkeletonCard, StateView, useToast } from '@/shared/ui';
import { TAB_BAR_SPACE } from '@/widgets/tab-bar';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = useUserStore((s) => s.user);
  const examDate = useUserStore((s) => s.examDate);
  const targetLevel = useUserStore((s) => s.targetLevel);
  const latest = useLatestResult();
  const tests = useTests();
  const showToast = useToast((s) => s.show);

  const resume = useMemo(() => tests.data?.find((t) => t.status === 'in_progress'), [tests.data]);
  const firstName = user?.name.split(' ')[0] ?? 'Aziza';

  const onResume = useCallback(() => {
    if (!resume) return;
    router.push({ pathname: '/test/[id]/[section]', params: { id: resume.id, section: resume.resumeSection ?? 'listening' } });
  }, [resume]);

  const onStartPlan = useCallback((item: PlanItem) => {
    router.push({ pathname: '/test/[id]/[section]', params: { id: 't13', section: item.section } });
  }, []);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + size.topGap, paddingBottom: insets.bottom + TAB_BAR_SPACE + space[4] },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <HomeHeader
        name={firstName}
        hasNotifications
        onBellPress={() => showToast({ message: "Yangi bildirishnomalar yo'q" })}
      />

      {latest.isPending ? (
        <SkeletonCard lines={4} />
      ) : latest.isError ? (
        <StateView tone="error" title="Xatolik" message="Internetni tekshiring" actionLabel="Qayta" onAction={() => latest.refetch()} />
      ) : (
        <ExamHero
          daysLeft={examDate ? daysUntil(examDate) : null}
          examDate={examDate}
          score={latest.data?.total ?? 0}
          target={targetLevel}
          onDatePress={() => router.push('/(onboarding)/exam-date')}
        />
      )}

      {resume ? <ContinueCard test={resume} onPress={onResume} /> : null}

      <TodayPlan items={todayPlan} onStart={onStartPlan} />

      {latest.data ? (
        <SectionsOverview sections={latest.data.sections} onPress={() => router.navigate('/(tabs)/progress')} />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: light.bg,
  },
  content: {
    paddingHorizontal: size.screenPadding,
    gap: space[3],
  },
});
