import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { light } from '../theme';

export const Radio = memo<{ selected: boolean }>(({ selected }) => (
  <View style={[styles.radio, selected ? styles.on : styles.off]} />
));

Radio.displayName = 'Radio';

const styles = StyleSheet.create({
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: light.surface,
  },
  off: {
    borderWidth: 1.5,
    borderColor: light.borderStrong,
  },
  on: {
    borderWidth: 7,
    borderColor: light.selectedBorder,
  },
});
