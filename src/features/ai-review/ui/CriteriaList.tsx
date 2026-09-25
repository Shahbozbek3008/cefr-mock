import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Criterion } from '@/entities/result';
import { light, space } from '@/shared/theme';
import { Card, ProgressBar, Text } from '@/shared/ui';
import { weakestLabel } from '../model/criteria';

export const CriteriaList = memo<{ criteria: Criterion[] }>(({ criteria }) => {
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
            color={c.label === weakest ? light.warning[500] : light.data}
            style={styles.bar}
          />
          <Text variant="monoCallout" style={styles.score}>
            {c.score}
            <Text variant="monoCallout" color={light.textTertiary}>
              {`/${c.max}`}
            </Text>
          </Text>
        </View>
      ))}
    </Card>
  );
});

CriteriaList.displayName = 'CriteriaList';

const styles = StyleSheet.create({
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
    borderBottomColor: light.divider,
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
});
