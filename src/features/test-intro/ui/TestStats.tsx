import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { light, radius, space } from '@/shared/theme';
import { Card, Text } from '@/shared/ui';

export type TestStatsProps = {
  items: readonly { value: string; label: string }[];
};

export const TestStats = memo<TestStatsProps>(({ items }) => (
  <Card radius={radius.xl} style={styles.card}>
    {items.map((item, index) => (
      <View key={item.label} style={[styles.cell, index > 0 && styles.divider]}>
        <Text variant="monoMd">{item.value}</Text>
        <Text variant="caption" color={light.textSecondary}>
          {item.label}
        </Text>
      </View>
    ))}
  </Card>
));

TestStats.displayName = 'TestStats';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    gap: space[0.5],
    paddingVertical: space[3.5],
    paddingHorizontal: space[4],
  },
  divider: {
    borderLeftWidth: 1,
    borderLeftColor: light.divider,
  },
});
