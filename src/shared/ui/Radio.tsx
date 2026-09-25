import { memo } from 'react';
import { View } from 'react-native';
import { makeStyles } from '../theme';

export const Radio = memo<{ selected: boolean }>(({ selected }) => {
  const styles = useStyles();
  return <View style={[styles.radio, selected ? styles.on : styles.off]} />;
});

Radio.displayName = 'Radio';

const useStyles = makeStyles(({ colors }) => ({
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surface,
  },
  off: {
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
  },
  on: {
    borderWidth: 7,
    borderColor: colors.selectedBorder,
  },
}));
