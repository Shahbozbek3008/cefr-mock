import { memo } from 'react';
import { Pressable, View } from 'react-native';
import type { Highlight } from '@/entities/attempt';
import { Colors, makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Text } from '@/shared/ui';

const highlightOrder: Highlight['color'][] = ['yellow', 'blue'];

export const highlightTone = (colors: Colors, color: Highlight['color']) =>
  ({
    yellow: { fill: colors.highlight, ring: colors.warning[500] },
    blue: { fill: colors.dataMuted, ring: colors.data },
  })[color];

export type HighlightToolbarProps = {
  active?: Highlight['color'];
  onPick: (color: Highlight['color']) => void;
  onNote: () => void;
};

export const HighlightToolbar = memo<HighlightToolbarProps>(({ active, onPick, onNote }) => {
  const styles = useStyles();
  const { colors, elevation } = useTheme();

  return (
    <View style={[styles.toolbar, elevation.floating]}>
      {highlightOrder.map((color) => (
        <Pressable
          key={color}
          accessibilityRole="button"
          accessibilityLabel={color === 'yellow' ? 'Sariq bilan belgilash' : "Ko'k bilan belgilash"}
          accessibilityState={{ selected: active === color }}
          onPress={() => onPick(color)}
          style={styles.swatchButton}
        >
          <View
            style={[
              styles.swatch,
              { backgroundColor: highlightTone(colors, color).fill },
              active === color && [styles.swatchActive, { outlineColor: highlightTone(colors, color).ring }],
            ]}
          />
        </Pressable>
      ))}
      <View style={styles.divider} />
      <Pressable accessibilityRole="button" onPress={onNote} style={styles.note}>
        <Text variant="callout" color={colors.textStrong}>
          Izoh
        </Text>
      </Pressable>
    </View>
  );
});

HighlightToolbar.displayName = 'HighlightToolbar';

const useStyles = makeStyles(({ colors }) => ({
  toolbar: {
    position: 'absolute',
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.popover,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[0.5],
    paddingHorizontal: space[1],
    zIndex: 2,
  },
  swatchButton: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  swatchActive: {
    borderWidth: 2,
    borderColor: colors.surface,
    outlineWidth: 1.5,
    outlineStyle: 'solid',
  },
  divider: {
    width: 1,
    height: 18,
    marginHorizontal: space[1],
    backgroundColor: colors.surfaceSubtle,
  },
  note: {
    height: 32,
    paddingHorizontal: space[2.5],
    justifyContent: 'center',
  },
}));
