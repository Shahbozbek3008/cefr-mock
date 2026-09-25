import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { Highlight } from '@/entities/attempt';
import { elevation, light, palette, radius, space } from '@/shared/theme';
import { Text } from '@/shared/ui';

export const highlightColors: Record<Highlight['color'], { fill: string; ring: string }> = {
  yellow: { fill: light.highlight, ring: light.warning[500] },
  blue: { fill: light.dataMuted, ring: light.data },
};

export type HighlightToolbarProps = {
  active?: Highlight['color'];
  onPick: (color: Highlight['color']) => void;
  onNote: () => void;
};

export const HighlightToolbar = memo<HighlightToolbarProps>(({ active, onPick, onNote }) => (
  <View style={[styles.toolbar, elevation.floating]}>
    {(Object.keys(highlightColors) as Highlight['color'][]).map((color) => (
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
            { backgroundColor: highlightColors[color].fill },
            active === color && [styles.swatchActive, { outlineColor: highlightColors[color].ring }],
          ]}
        />
      </Pressable>
    ))}
    <View style={styles.divider} />
    <Pressable accessibilityRole="button" onPress={onNote} style={styles.note}>
      <Text variant="callout" color={light.textStrong}>
        Izoh
      </Text>
    </Pressable>
  </View>
));

HighlightToolbar.displayName = 'HighlightToolbar';

const styles = StyleSheet.create({
  toolbar: {
    position: 'absolute',
    height: 40,
    borderRadius: radius.md,
    backgroundColor: palette.white.a92,
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
    borderColor: light.surface,
    outlineWidth: 1.5,
    outlineStyle: 'solid',
  },
  divider: {
    width: 1,
    height: 18,
    marginHorizontal: space[1],
    backgroundColor: light.surfaceSubtle,
  },
  note: {
    height: 32,
    paddingHorizontal: space[2.5],
    justifyContent: 'center',
  },
});
