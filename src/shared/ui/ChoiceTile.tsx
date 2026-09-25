import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { light, radius, space } from '../theme';
import { CheckBadge } from './CheckBadge';
import { Text } from './Text';

export type ChoiceTileProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export const ChoiceTile = memo<ChoiceTileProps>(({ label, selected, onPress }) => (
  <Pressable
    accessibilityRole="radio"
    accessibilityState={{ selected }}
    accessibilityLabel={label}
    onPress={onPress}
    style={[styles.tile, selected ? styles.selected : styles.idle]}
  >
    <Text
      variant={selected ? 'bodySmMedium' : 'bodySm'}
      color={selected ? light.selectedText : light.text}
      numberOfLines={1}
      style={styles.label}
    >
      {label}
    </Text>
    {selected ? <CheckBadge size={18} /> : null}
  </Pressable>
));

ChoiceTile.displayName = 'ChoiceTile';

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    height: 50,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
    paddingHorizontal: space[3],
  },
  idle: {
    backgroundColor: light.surface,
    borderWidth: 1,
    borderColor: light.border,
  },
  selected: {
    backgroundColor: light.selectedBg,
    borderWidth: 1.5,
    borderColor: light.selectedBorder,
  },
  label: {
    flex: 1,
  },
});
