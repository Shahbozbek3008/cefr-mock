import { memo } from 'react';
import { View } from 'react-native';
import type { Criterion } from '@/entities/result';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { ProgressBar, Text } from '@/shared/ui';
import { weakestLabel } from '../model/criteria';

export const CriteriaTiles = memo<{ criteria: Criterion[] }>(({ criteria }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const weakest = weakestLabel(criteria);

  return (
    <View style={styles.grid}>
      {criteria.map((c) => (
        <View key={c.label} style={styles.tile}>
          <Text variant="caption" color={colors.textSecondary}>
            {c.label}
          </Text>
          <Text variant="statMd">
            {c.score}
            <Text variant="monoXs" color={colors.textTertiary}>
              {` /${c.max}`}
            </Text>
          </Text>
          <ProgressBar
            value={c.score / c.max}
            height={3}
            track={colors.skeleton}
            color={c.label === weakest ? colors.warning[500] : colors.data}
          />
        </View>
      ))}
    </View>
  );
});

CriteriaTiles.displayName = 'CriteriaTiles';

const useStyles = makeStyles(({ colors }) => ({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    borderRadius: radius.button,
    backgroundColor: colors.surfaceMuted,
    paddingVertical: space[3],
    paddingHorizontal: space[3.5],
    gap: space[1.5],
  },
}));
