import { memo } from 'react';
import { View } from 'react-native';
import { makeStyles, palette } from '../theme';

export type ProgressStepsProps = {
  total: number;
  current: number;
};

export const ProgressSteps = memo<ProgressStepsProps>(({ total, current }) => {
  const styles = useStyles();

  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, index) => (
        <View key={index} style={[styles.step, index < current ? styles.done : styles.pending]} />
      ))}
    </View>
  );
});

ProgressSteps.displayName = 'ProgressSteps';

const useStyles = makeStyles(({ colors }) => ({
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
  },
  step: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  done: {
    backgroundColor: palette.primary[600],
  },
  pending: {
    backgroundColor: colors.border,
  },
}));
