import { memo } from 'react';
import { View } from 'react-native';
import type { Criterion } from '@/entities/result';
import { makeStyles, space, useTheme } from '@/shared/theme';
import { Card, ProgressBar, Text } from '@/shared/ui';
import { weakestLabel } from '../model/criteria';

export const CriteriaList = memo<{ criteria: Criterion[] }>(({ criteria }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const weakest = weakestLabel(criteria);

  return (
    <Card style={styles.card}>
      {criteria.map((c, index) => (
        <View key={c.label} style={[styles.row, index < criteria.length - 1 && styles.divider]}>
          <Text variant="bodySm" style={styles.label}>
            {c.label}
          </Text>
          <ProgressBar
            value={c.score / c.max}
            color={c.label === weakest ? colors.warning[500] : colors.data}
            style={styles.bar}
          />
          <Text variant="monoCallout" style={styles.score}>
            {c.score}
            <Text variant="monoCallout" color={colors.textTertiary}>
              {`/${c.max}`}
            </Text>
          </Text>
        </View>
      ))}
    </Card>
  );
});

CriteriaList.displayName = 'CriteriaList';

const useStyles = makeStyles(({ colors }) => ({
  card: {
    paddingVertical: space[1],
    paddingHorizontal: space[4],
  },
  row: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  label: {
    flex: 1,
  },
  bar: {
    width: 64,
  },
  score: {
    width: 36,
    textAlign: 'right',
  },
}));
