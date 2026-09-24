import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { ProgressData } from '@/entities/result';
import { MAX_SCORE } from '@/shared/lib';
import { light, space } from '@/shared/theme';
import { Card, Delta, Dot, ProgressBar, Text } from '@/shared/ui';

export type SectionProgressProps = {
  sections: ProgressData['sections'];
  periodLabel: string;
};

export const SectionProgress = memo<SectionProgressProps>(({ sections, periodLabel }) => (
  <Card style={styles.card}>
    <View style={styles.header}>
      <Text variant="bodySmMedium">Bo'limlar</Text>
      <Text variant="caption" color={light.textSecondary}>
        {periodLabel}
      </Text>
    </View>
    {sections.map((section, index) => (
      <View key={section.title} style={[styles.row, index < sections.length - 1 && styles.divider]}>
        <View style={styles.title}>
          <Text variant="bodySm">{section.title}</Text>
          {section.weak ? <Dot color={light.warning[500]} /> : null}
        </View>
        <ProgressBar
          value={section.score / MAX_SCORE}
          color={section.weak ? light.warning[500] : light.data}
          style={styles.bar}
        />
        <View style={styles.value}>
          <Text variant="monoCallout">{section.score}</Text>
          <Delta value={section.delta} />
        </View>
      </View>
    ))}
  </Card>
));

SectionProgress.displayName = 'SectionProgress';

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: space[4],
    paddingBottom: space[1],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: space[3],
    paddingBottom: space[1],
  },
  row: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: light.divider,
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1.5],
  },
  bar: {
    width: 90,
  },
  value: {
    width: 44,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
    gap: space[1],
  },
});
