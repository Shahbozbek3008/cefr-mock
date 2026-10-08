import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchPracticeTest } from '@cefr/core';
import { useUnreadCount } from '@/entities/notification';
import { useLatestResult } from '@/entities/result';
import { dayKey, streakOf, useStudyDays, weekDays, weekdayIndex, weeklyPlan } from '@/entities/study';
import { useTests } from '@/entities/test';
import type { SectionKind } from '@/entities/test';
import { useUserStore } from '@/entities/user/model';
import { DEFAULT_DAILY_MINUTES, todayPlanOf } from '@/features/home/model/plan';
import type { PlanItem } from '@/features/home/model/plan';
import { ContinueCard } from '@/features/home/ui/ContinueCard';
import { ExamHero } from '@/features/home/ui/ExamHero';
import { HomeHeader } from '@/features/home/ui/HomeHeader';
import { ExamHeroSkeleton, SectionsOverviewSkeleton } from '@/features/home/ui/HomeSkeleton';
import { SectionsOverview } from '@/features/home/ui/SectionsOverview';
import { StudyWeek } from '@/features/home/ui/StudyWeek';
import { TodayPlan } from '@/features/home/ui/TodayPlan';
import { failureReason, supabase } from '@/shared/api';
import { useI18n } from '@/shared/i18n';
import { daysUntil, useRefresh, useScrollHeader } from '@/shared/lib';
import { makeStyles, size, space } from '@/shared/theme';
import { HeaderSurface, RefreshControl, StateView, useToast } from '@/shared/ui';
import { TAB_BAR_SPACE } from '@/widgets/tab-bar';

export default function HomeScreen() {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const showToast = useToast((s) => s.show);
  const user = useUserStore((s) => s.user);
  const examDate = useUserStore((s) => s.examDate);
  const targetLevel = useUserStore((s) => s.targetLevel);
  const dailyMinutes = useUserStore((s) => s.dailyMinutes);
  const latest = useLatestResult();
  const unread = useUnreadCount();
  const tests = useTests();
  const study = useStudyDays();
  const refresh = useRefresh(latest.refetch, tests.refetch, study.refetch);
  const { scrollY, onScroll } = useScrollHeader();

  const resume = useMemo(() => tests.data?.find((t) => t.status === 'in_progress'), [tests.data]);
  const firstName = user?.firstName ?? '';

  const today = new Date();
  const minutesByDay = study.data ?? {};
  const studiedMinutes = minutesByDay[dayKey(today)] ?? 0;
  const goalMinutes = dailyMinutes ?? DEFAULT_DAILY_MINUTES;
  const plan = weeklyPlan(
    Object.fromEntries((latest.data?.sections ?? []).map((section) => [section.kind, section.score])) as Partial<
      Record<SectionKind, number>
    >,
  );
  const todayIndex = weekdayIndex(today);
  const week = weekDays(today).map((key, index) => ({
    key,
    section: plan[index],
    studied: (minutesByDay[key] ?? 0) > 0,
    today: index === todayIndex,
  }));

  const onResume = useCallback(() => {
    if (!resume) return;
    router.push({
      pathname: '/test/[id]/[section]',
      params: { id: resume.id, section: resume.resumeSection ?? 'listening' },
    });
  }, [resume]);

  const onStartPlan = useCallback(
    async (item: PlanItem) => {
      try {
        const testId = await fetchPracticeTest(supabase, item.section);
        if (!testId) throw new Error('practice_unavailable');
        router.push({ pathname: '/test/[id]/[section]', params: { id: testId, section: item.section, scope: item.section } });
      } catch (error) {
        showToast({ message: `${t('session.startFailed')} ${t(failureReason(error))}`, tone: 'error' });
      }
    },
    [showToast, t],
  );

  return (
    <View style={styles.screen}>
      <HeaderSurface scrollY={scrollY}>
        <HomeHeader
          name={firstName}
          avatarUrl={user?.avatarUrl ?? null}
          hasNotifications={unread > 0}
          onBellPress={() => router.push('/notifications')}
        />
      </HeaderSurface>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + TAB_BAR_SPACE + space[4] }]}
        refreshControl={<RefreshControl refreshing={refresh.refreshing} onRefresh={refresh.onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {latest.isPending ? (
          <ExamHeroSkeleton />
        ) : latest.isError ? (
          <StateView
            tone="error"
            title={t('common.error')}
            message={t(failureReason(latest.error))}
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

        <StudyWeek
          streak={streakOf(minutesByDay, today)}
          studiedMinutes={studiedMinutes}
          goalMinutes={goalMinutes}
          days={week}
        />

        <TodayPlan items={todayPlanOf(plan[todayIndex], goalMinutes, studiedMinutes)} onStart={onStartPlan} />

        {latest.data ? (
          <SectionsOverview sections={latest.data.sections} onPress={() => router.navigate('/(tabs)/progress')} />
        ) : latest.isPending ? (
          <SectionsOverviewSkeleton />
        ) : null}
      </Animated.ScrollView>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingTop: space[3],
    paddingHorizontal: size.screenPadding,
    gap: space[3],
  },
}));
