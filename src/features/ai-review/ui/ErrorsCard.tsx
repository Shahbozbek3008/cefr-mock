import { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import type { Correction, TextSegment } from '@/entities/result';
import { light, radius, space } from '@/shared/theme';
import { Card, Text } from '@/shared/ui';
import { MarkedText } from './MarkedText';

const legend = [
  { label: 'Grammar', color: light.error[500] },
  { label: "Lug'at", color: light.warning[500] },
];

export type ErrorsCardProps = {
  segments: TextSegment[];
  corrections: Correction[];
};

export const ErrorsCard = memo<ErrorsCardProps>(({ segments, corrections }) => {
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
              <Text variant="micro" color={light.textSecondary}>
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
            <Text variant="monoCallout" color={light.error.text} style={styles.struck}>
              {correction.from}
            </Text>
            <ArrowRight size={13} color={light.textStrong} strokeWidth={1.6} />
            <Text variant="monoCalloutMedium" color={light.success.text}>
              {correction.to}
            </Text>
          </View>
          <Text variant="caption" color={light.textSecondary}>
            {correction.note}
          </Text>
        </View>
      ) : null}
    </Card>
  );
});

ErrorsCard.displayName = 'ErrorsCard';

const styles = StyleSheet.create({
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
    backgroundColor: light.bg,
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
});
