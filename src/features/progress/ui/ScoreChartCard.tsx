import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { ProgressData } from '@/entities/result';
import { levelThresholds } from '@/shared/lib';
import { radius, space, useTheme } from '@/shared/theme';
import { Card, Tag, Text } from '@/shared/ui';
import { LineChart } from '@/shared/ui/charts';

const guides = [
  { value: levelThresholds[1].min, label: `B2 · ${levelThresholds[1].min}`, strong: true },
  { value: levelThresholds[2].min, label: `C1 · ${levelThresholds[2].min}` },
];

const DOMAIN = [33.84, 69.15] as const;

export const ScoreChartCard = memo<{ data: ProgressData }>(({ data }) => {
  const { colors } = useTheme();

  return (
    <Card level="strong" radius={radius.cardLg} style={styles.card}>
      <View style={styles.top}>
        <View style={styles.summary}>
          <Text variant="caption" color={colors.textSecondary}>
            Umumiy ball
          </Text>
          <View style={styles.valueRow}>
            <Text variant="displaySm">{data.total}</Text>
            <Tag label={`${data.delta >= 0 ? '+' : '−'}${Math.abs(data.delta)}`} tone="success" mono />
          </View>
        </View>
        <Text variant="monoXs" color={colors.textTertiary}>
          {`${data.testsCount} test`}
        </Text>
      </View>

      <LineChart values={data.values} guides={guides} domain={DOMAIN} />

      <View style={styles.axis}>
        {data.axis.map((label) => (
          <Text key={label} variant="monoNano" color={colors.textTertiary}>
            {label}
          </Text>
        ))}
      </View>
    </Card>
  );
});

ScoreChartCard.displayName = 'ScoreChartCard';

const styles = StyleSheet.create({
  card: {
    paddingTop: space[4.5],
    paddingHorizontal: space[4.5],
    paddingBottom: space[3],
    gap: space[2.5],
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  summary: {
    gap: space[1],
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space[2],
  },
  axis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: space[1],
  },
});
