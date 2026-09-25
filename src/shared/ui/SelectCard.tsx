import { ReactNode, memo } from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { makeStyles, radius, useTheme } from '../theme';

export type SelectCardProps = {
  selected: boolean;
  onPress: () => void;
  children: ReactNode;
  accessibilityLabel: string;
  style?: ViewStyle;
};

export const SelectCard = memo<SelectCardProps>(({ selected, onPress, children, accessibilityLabel, style }) => {
  const styles = useStyles();
  const { elevation } = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[styles.card, selected ? styles.selected : styles.idle, selected && elevation.selected, style]}
    >
      {children}
    </Pressable>
  );
});

SelectCard.displayName = 'SelectCard';

const useStyles = makeStyles(({ colors }) => ({
  card: {
    borderRadius: radius.card,
    padding: 16,
  },
  idle: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: {
    backgroundColor: colors.selectedBg,
    borderWidth: 1.5,
    borderColor: colors.selectedBorder,
  },
}));
