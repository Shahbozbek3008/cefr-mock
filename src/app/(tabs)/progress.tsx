import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgress } from '@/entities/result';
import type { HistoryItem, ProgressPeriod } from '@/entities/result';
import { HistoryList } from '@/features/progress/ui/HistoryList';
import { ScoreChartCard } from '@/features/progress/ui/ScoreChartCard';
import { ProgressSkeleton } from '@/features/progress/ui/ProgressSkeleton';
import { SectionProgress } from '@/features/progress/ui/SectionProgress';
import { useI18n } from '@/shared/i18n';
import { useRefresh } from '@/shared/lib';
import { hitSlop, makeStyles, size, space, useTheme } from '@/shared/theme';
import { RefreshControl, SegmentedControl, StateView, Text } from '@/shared/ui';
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

  const onHistoryPress = useCallback((item: HistoryItem) => {
    router.push({ pathname: '/result/[id]', params: { id: item.resultId } });
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
      <View style={styles.header}>
        <Text variant="titleLg">{t('progress.title')}</Text>
        <SegmentedControl options={periodOptions} value={period} onChange={setPeriod} size="sm" fit />
      </View>

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
      ) : progress.isError ? (
        <StateView
          tone="error"
          title={t('common.error')}
          message={t('common.checkInternet')}
          actionLabel={t('common.retry')}
          onAction={() => progress.refetch()}
        />
      ) : (
        <ProgressSkeleton />
      )}
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
  header: {
    height: size.headerBar,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[1],
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: space[1],
  },
}));
