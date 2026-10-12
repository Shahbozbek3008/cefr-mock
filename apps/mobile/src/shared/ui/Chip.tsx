import { memo } from 'react';
import { Pressable } from 'react-native';
import { makeStyles, radius, space, useTheme } from '../theme';
import { Text } from './Text';

export type ChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export const Chip = memo<ChipProps>(({ label, active = false, onPress }) => {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.chip, active ? styles.active : styles.idle]}
    >
      <Text variant={active ? 'calloutMedium' : 'callout'} color={active ? colors.selectedText : colors.text}>
        {label}
      </Text>
    </Pressable>
  );
});

Chip.displayName = 'Chip';

const useStyles = makeStyles(({ colors }) => ({
  chip: {
    height: 34,
    paddingHorizontal: space[3.5],
    borderRadius: radius.pill,
    justifyContent: 'center',
  },
  idle: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  active: {
    backgroundColor: colors.chipActiveBg,
  },
}));
