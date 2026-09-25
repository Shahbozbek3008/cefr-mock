import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Criterion } from '@/entities/result';
import { light, radius, space } from '@/shared/theme';
import { ProgressBar, Text } from '@/shared/ui';
import { weakestLabel } from '../model/criteria';

export const CriteriaTiles = memo<{ criteria: Criterion[] }>(({ criteria }) => {
  const weakest = weakestLabel(criteria);

  return (
    <View style={styles.grid}>
      {criteria.map((c) => (
        <View key={c.label} style={styles.tile}>
          <Text variant="caption" color={light.textSecondary}>
            {c.label}
          </Text>
          <Text variant="statMd">
            {c.score}
            <Text variant="monoXs" color={light.textTertiary}>
              {` /${c.max}`}
            </Text>
          </Text>
          <ProgressBar
            value={c.score / c.max}
            height={3}
            track={light.skeleton}
            color={c.label === weakest ? light.warning[500] : light.data}
          />
        </View>
      ))}
    </View>
  );
});

CriteriaTiles.displayName = 'CriteriaTiles';

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    borderRadius: radius.button,
    backgroundColor: light.surfaceMuted,
    paddingVertical: space[3],
    paddingHorizontal: space[3.5],
    gap: space[1.5],
  },
});
