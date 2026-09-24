import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { light, radius, space } from '../theme';
import { Text } from './Text';

export type ChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export const Chip = memo<ChipProps>(({ label, active = false, onPress }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ selected: active }}
    onPress={onPress}
    style={[styles.chip, active ? styles.active : styles.idle]}
  >
    <Text variant={active ? 'calloutMedium' : 'callout'} color={active ? light.selectedText : light.text}>
      {label}
    </Text>
  </Pressable>
));

Chip.displayName = 'Chip';

const styles = StyleSheet.create({
  chip: {
    height: 34,
    paddingHorizontal: space[3.5],
    borderRadius: radius.pill,
    justifyContent: 'center',
  },
  idle: {
    backgroundColor: light.surface,
    borderWidth: 1,
    borderColor: light.border,
  },
  active: {
    backgroundColor: light.chipActiveBg,
  },
});
