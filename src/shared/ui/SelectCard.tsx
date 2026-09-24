import { ReactNode, memo } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { elevation, light, radius } from '../theme';

export type SelectCardProps = {
  selected: boolean;
  onPress: () => void;
  children: ReactNode;
  accessibilityLabel: string;
  style?: ViewStyle;
};

export const SelectCard = memo<SelectCardProps>(
  ({ selected, onPress, children, accessibilityLabel, style }) => (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[
        styles.card,
        selected ? styles.selected : styles.idle,
        selected && elevation.selected,
        style,
      ]}
    >
      {children}
    </Pressable>
  ),
);

SelectCard.displayName = 'SelectCard';

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    padding: 16,
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
});
