import { useCallback, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnreadCount } from '@/entities/notification';
import { useLatestResult } from '@/entities/result';
import { useTests } from '@/entities/test';
import { useUserStore } from '@/entities/user/model';
import { todayPlan } from '@/features/home/model/plan';
import type { PlanItem } from '@/features/home/model/plan';
import { ContinueCard } from '@/features/home/ui/ContinueCard';
import { ExamHero } from '@/features/home/ui/ExamHero';
import { HomeHeader } from '@/features/home/ui/HomeHeader';
import { ExamHeroSkeleton, SectionsOverviewSkeleton } from '@/features/home/ui/HomeSkeleton';
import { SectionsOverview } from '@/features/home/ui/SectionsOverview';
import { TodayPlan } from '@/features/home/ui/TodayPlan';
import { useI18n } from '@/shared/i18n';
import { daysUntil, useRefresh } from '@/shared/lib';
import { makeStyles, size, space } from '@/shared/theme';
import { RefreshControl, StateView } from '@/shared/ui';
import { TAB_BAR_SPACE } from '@/widgets/tab-bar';

export default function HomeScreen() {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const user = useUserStore((s) => s.user);
  const examDate = useUserStore((s) => s.examDate);
  const targetLevel = useUserStore((s) => s.targetLevel);
  const latest = useLatestResult();
  const unread = useUnreadCount();
  const tests = useTests();
  const refresh = useRefresh(latest.refetch, tests.refetch);

  const resume = useMemo(() => tests.data?.find((t) => t.status === 'in_progress'), [tests.data]);
  const firstName = user?.name.split(' ')[0] ?? 'Aziza';

  const onResume = useCallback(() => {
    if (!resume) return;
    router.push({
      pathname: '/test/[id]/[section]',
      params: { id: resume.id, section: resume.resumeSection ?? 'listening' },
    });
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
      refreshControl={
        <RefreshControl refreshing={refresh.refreshing} onRefresh={refresh.onRefresh} offset={insets.top} />
      }
      showsVerticalScrollIndicator={false}
    >
      <HomeHeader name={firstName} hasNotifications={unread > 0} onBellPress={() => router.push('/notifications')} />

      {latest.isPending ? (
        <ExamHeroSkeleton />
      ) : latest.isError ? (
        <StateView
          tone="error"
          title={t('common.error')}
          message={t('common.checkInternet')}
          actionLabel={t('common.retry')}
          onAction={() => latest.refetch()}
        />
      ) : (
        <ExamHero
          daysLeft={examDate ? daysUntil(examDate) : null}
          examDate={examDate}
          score={latest.data?.total ?? 0}
          target={targetLevel}
          onDatePress={() => router.push({ pathname: '/(onboarding)/exam-date', params: { edit: '1' } })}
        />
      )}

      {resume ? <ContinueCard test={resume} onPress={onResume} /> : null}

      <TodayPlan items={todayPlan} onStart={onStartPlan} />

      {latest.data ? (
        <SectionsOverview sections={latest.data.sections} onPress={() => router.navigate('/(tabs)/progress')} />
      ) : latest.isPending ? (
        <SectionsOverviewSkeleton />
      ) : null}
    </ScrollView>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: size.screenPadding,
    gap: space[3],
  },
}));
