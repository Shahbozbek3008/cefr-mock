import { memo, useState } from 'react';
import { View } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import type { Correction, TextSegment } from '@/entities/result';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Card, Text } from '@/shared/ui';
import { MarkedText } from './MarkedText';

export type ErrorsCardProps = {
  segments: TextSegment[];
  corrections: Correction[];
};

export const ErrorsCard = memo<ErrorsCardProps>(({ segments, corrections }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const legend = [
    { label: 'Grammar', color: colors.error[500] },
    { label: "Lug'at", color: colors.warning[500] },
  ];
  const [active, setActive] = useState(corrections[0]?.from);
  const correction = corrections.find((c) => c.from === active);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="bodySmMedium">Matndagi xatolar</Text>
        <View style={styles.legend}>
          {legend.map((item) => (
            <View key={item.label} style={styles.legendItem}>
              <View style={[styles.swatch, { backgroundColor: item.color }]} />
              <Text variant="micro" color={colors.textSecondary}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <MarkedText segments={segments} onMarkPress={setActive} />

      {correction ? (
        <View style={styles.correction}>
          <View style={styles.swap}>
            <Text variant="monoCallout" color={colors.error.text} style={styles.struck}>
              {correction.from}
            </Text>
            <ArrowRight size={13} color={colors.textStrong} strokeWidth={1.6} />
            <Text variant="monoCalloutMedium" color={colors.success.text}>
              {correction.to}
            </Text>
          </View>
          <Text variant="caption" color={colors.textSecondary}>
            {correction.note}
          </Text>
        </View>
      ) : null}
    </Card>
  );
});

ErrorsCard.displayName = 'ErrorsCard';

const useStyles = makeStyles(({ colors }) => ({
  card: {
    padding: space[4],
    gap: space[2.5],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legend: {
    flexDirection: 'row',
    gap: space[2.5],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
  },
  swatch: {
    width: 8,
    height: 3,
    borderRadius: 2,
  },
  correction: {
    borderRadius: radius.md,
    backgroundColor: colors.bg,
    paddingVertical: space[2.5],
    paddingHorizontal: space[3],
    gap: space[1],
  },
  swap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  struck: {
    textDecorationLine: 'line-through',
  },
}));
