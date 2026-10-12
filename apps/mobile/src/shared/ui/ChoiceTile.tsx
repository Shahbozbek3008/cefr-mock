import { memo } from 'react';
import { Pressable } from 'react-native';
import { makeStyles, radius, space, useTheme } from '../theme';
import { CheckBadge } from './CheckBadge';
import { Text } from './Text';

export type ChoiceTileProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export const ChoiceTile = memo<ChoiceTileProps>(({ label, selected, onPress }) => {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.tile, selected ? styles.selected : styles.idle]}
    >
      <Text
        variant={selected ? 'bodySmMedium' : 'bodySm'}
        color={selected ? colors.selectedText : colors.text}
        numberOfLines={1}
        style={styles.label}
      >
        {label}
      </Text>
      {selected ? <CheckBadge size={18} /> : null}
    </Pressable>
  );
});

ChoiceTile.displayName = 'ChoiceTile';

const useStyles = makeStyles(({ colors }) => ({
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: {
    backgroundColor: colors.selectedBg,
    borderWidth: 1.5,
    borderColor: colors.selectedBorder,
  },
  label: {
    flex: 1,
  },
}));
