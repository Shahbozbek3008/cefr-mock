import { memo } from 'react';
import { View } from 'react-native';
import { ArrowDown, ArrowUp } from 'lucide-react-native';
import { useI18n } from '@/shared/i18n';
import { MAX_SCORE, levelFor, levelNames, levelThresholds } from '@/shared/lib';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Card, Text } from '@/shared/ui';
import { GaugeArc } from '@/shared/ui/charts';

const marks = levelThresholds.map((t) => ({ value: t.min, label: t.level }));

export type ResultGaugeProps = {
  total: number;
  delta: number;
};

export const ResultGauge = memo<ResultGaugeProps>(({ total, delta }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const level = levelFor(total);
  const DeltaIcon = delta < 0 ? ArrowDown : ArrowUp;
  const deltaTone = delta < 0 ? colors.error : colors.success;

  return (
    <Card level="strong" radius={radius.hero} style={styles.card}>
      <View style={styles.gauge}>
        <GaugeArc value={total} max={MAX_SCORE} marks={marks} activeLabel={level} />
        <View style={styles.score}>
          <Text variant="displayXl">{total}</Text>
          <Text variant="monoSm" color={colors.textTertiary}>
            {t('result.points', { max: MAX_SCORE })}
          </Text>
        </View>
      </View>

      <View style={styles.tags}>
        <View style={styles.level}>
          <Text variant="calloutMedium" color={colors.selectedText}>
            {`${level} · ${levelNames[level]}`}
          </Text>
        </View>
        {delta !== 0 ? (
          <View style={[styles.delta, { backgroundColor: deltaTone.bg }]}>
            <DeltaIcon size={11} color={deltaTone.text} strokeWidth={2.5} />
            <Text variant="monoSmMedium" color={deltaTone.text}>
              {`${delta > 0 ? '+' : '−'}${Math.abs(delta)}`}
            </Text>
          </View>
        ) : null}
      </View>
    </Card>
  );
});

ResultGauge.displayName = 'ResultGauge';

const useStyles = makeStyles(({ colors }) => ({
  card: {
    alignItems: 'center',
    paddingTop: space[4.5],
    paddingHorizontal: space[4.5],
    paddingBottom: space[5],
    gap: space[3],
  },
  gauge: {
    width: 300,
    height: 165,
  },
  score: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: space[1],
    alignItems: 'center',
    gap: space[1],
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  level: {
    height: 28,
    paddingHorizontal: space[3],
    borderRadius: radius.pill,
    backgroundColor: colors.chipActiveBg,
    justifyContent: 'center',
  },
  delta: {
    height: 28,
    paddingHorizontal: space[2.5],
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
  },
}));
