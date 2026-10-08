import { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgress } from '@/entities/result';
import type { HistoryItem, ProgressPeriod } from '@/entities/result';
import { HistoryList } from '@/features/progress/ui/HistoryList';
import { ScoreChartCard } from '@/features/progress/ui/ScoreChartCard';
import { ProgressEmpty } from '@/features/progress/ui/ProgressEmpty';
import { ProgressSkeleton } from '@/features/progress/ui/ProgressSkeleton';
import { SectionProgress } from '@/features/progress/ui/SectionProgress';
import { failureReason } from '@/shared/api';
import { useI18n } from '@/shared/i18n';
import { useRefresh, useScrollHeader } from '@/shared/lib';
import { hitSlop, makeStyles, size, space, useTheme } from '@/shared/theme';
import { RefreshControl, ScreenHeader, SegmentedControl, StateView, Text } from '@/shared/ui';
import { TAB_BAR_SPACE } from '@/widgets/tab-bar';

const periods: ProgressPeriod[] = ['1m', '3m', 'all'];

export default function ProgressScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const periodOptions = useMemo(() => periods.map((value) => ({ value, label: t(`progress.periods.${value}`) })), [t]);
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<ProgressPeriod>('3m');
  const progress = useProgress(period);
  const refresh = useRefresh(progress.refetch);
  const { scrollY, onScroll } = useScrollHeader();

  const onHistoryPress = useCallback((item: HistoryItem) => {
    router.push({ pathname: '/result/[id]', params: { id: item.resultId } });
  }, []);

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={t('progress.title')}
        scrollY={scrollY}
        right={<SegmentedControl options={periodOptions} value={period} onChange={setPeriod} size="sm" fit />}
      />
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + TAB_BAR_SPACE + space[4] }]}
        refreshControl={<RefreshControl refreshing={refresh.refreshing} onRefresh={refresh.onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {progress.data ? (
          <>
            <ScoreChartCard data={progress.data} />
            <SectionProgress sections={progress.data.sections} periodLabel={t(`progress.periodLabels.${period}`)} />
            <View style={styles.historyHeader}>
              <Text variant="labelMedium">{t('progress.history')}</Text>
              <Pressable accessibilityRole="button" hitSlop={hitSlop} onPress={() => router.navigate('/(tabs)/tests')}>
                <Text variant="calloutMedium" color={colors.link}>
                  {t('common.all')}
                </Text>
              </Pressable>
            </View>
            <HistoryList items={progress.data.history} onPress={onHistoryPress} />
          </>
        ) : progress.isSuccess ? (
          <ProgressEmpty onStart={() => router.navigate('/(tabs)/tests')} />
        ) : progress.isError ? (
          <StateView
            tone="error"
            title={t('common.error')}
            message={t(failureReason(progress.error))}
            actionLabel={t('common.retry')}
            onAction={() => progress.refetch()}
          />
        ) : (
          <ProgressSkeleton />
        )}
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
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: space[1],
  },
}));
