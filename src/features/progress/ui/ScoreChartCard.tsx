import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { ProgressData } from '@/entities/result';
import { useI18n } from '@/shared/i18n';
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
  const { t, dict } = useI18n();

  return (
    <Card level="strong" radius={radius.cardLg} style={styles.card}>
      <View style={styles.top}>
        <View style={styles.summary}>
          <Text variant="caption" color={colors.textSecondary}>
            {t('progress.totalScore')}
          </Text>
          <View style={styles.valueRow}>
            <Text variant="displaySm">{data.total}</Text>
            <Tag label={`${data.delta >= 0 ? '+' : '−'}${Math.abs(data.delta)}`} tone="success" mono />
          </View>
        </View>
        <Text variant="monoXs" color={colors.textTertiary}>
          {t('units.tests', { count: data.testsCount })}
        </Text>
      </View>

      <LineChart values={data.values} guides={guides} domain={DOMAIN} />

      <View style={styles.axis}>
        {data.axis.map((mark) => {
          const month = dict.date.monthsShort[mark.month];
          const label = mark.day ? `${mark.day} ${month}` : month;
          return (
            <Text key={label} variant="monoNano" color={colors.textTertiary}>
              {label}
            </Text>
          );
        })}
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
