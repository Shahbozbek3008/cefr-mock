import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgress } from '@/entities/result';
import type { HistoryItem, ProgressPeriod } from '@/entities/result';
import { HistoryList } from '@/features/progress/ui/HistoryList';
import { ScoreChartCard } from '@/features/progress/ui/ScoreChartCard';
import { SectionProgress } from '@/features/progress/ui/SectionProgress';
import { hitSlop, light, size, space } from '@/shared/theme';
import { SegmentedControl, SkeletonCard, StateView, Text } from '@/shared/ui';
import { TAB_BAR_SPACE } from '@/widgets/tab-bar';

const periodOptions = [
  { value: '1m', label: '1 oy' },
  { value: '3m', label: '3 oy' },
  { value: 'all', label: 'Hammasi' },
] as const;

const periodLabels: Record<ProgressPeriod, string> = {
  '1m': '1 oy ichida',
  '3m': '3 oy ichida',
  all: 'Barcha vaqt',
};

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<ProgressPeriod>('3m');
  const progress = useProgress(period);

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
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text variant="titleLg">Progress</Text>
        <SegmentedControl options={periodOptions} value={period} onChange={setPeriod} size="sm" fit />
      </View>

      {progress.data ? (
        <>
          <ScoreChartCard data={progress.data} />
          <SectionProgress sections={progress.data.sections} periodLabel={periodLabels[period]} />
          <View style={styles.historyHeader}>
            <Text variant="labelMedium">Tarix</Text>
            <Pressable accessibilityRole="button" hitSlop={hitSlop} onPress={() => router.navigate('/(tabs)/tests')}>
              <Text variant="calloutMedium" color={light.link}>
                Barchasi
              </Text>
            </Pressable>
          </View>
          <HistoryList items={progress.data.history} onPress={onHistoryPress} />
        </>
      ) : progress.isError ? (
        <StateView
          tone="error"
          title="Xatolik"
          message="Internetni tekshiring"
          actionLabel="Qayta"
          onAction={() => progress.refetch()}
        />
      ) : (
        <>
          <SkeletonCard lines={5} />
          <SkeletonCard lines={4} />
        </>
      )}
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
});
