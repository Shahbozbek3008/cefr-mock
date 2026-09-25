import { memo } from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { makeStyles, radius, TypeToken, useTheme } from '../theme';
import { Text } from './Text';

export type SegmentedControlProps<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  size?: Size;
  fit?: boolean;
  style?: ViewStyle;
};

type Size = 'sm' | 'compact' | 'md' | 'lg';

const metrics: Record<
  Size,
  { height: number; pad: number; track: number; seg: number; text: TypeToken; active: TypeToken }
> = {
  sm: { height: 32, pad: 3, track: radius.sm, seg: radius.tag, text: 'caption', active: 'captionMedium' },
  compact: { height: 36, pad: 3, track: radius.input, seg: radius.segment, text: 'caption', active: 'captionMedium' },
  md: { height: 36, pad: 3, track: radius.input, seg: radius.segment, text: 'callout', active: 'calloutMedium' },
  lg: { height: 40, pad: 4, track: radius.track, seg: radius.sm, text: 'bodySm', active: 'bodySmMedium' },
};

const SegmentedControlBase = <T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  fit = false,
  style,
}: SegmentedControlProps<T>) => {
  const styles = useStyles();
  const { colors, elevation } = useTheme();
  const m = metrics[size];

  return (
    <View
      accessibilityRole="tablist"
      style={[styles.track, { height: m.height, padding: m.pad, borderRadius: m.track }, fit && styles.fit, style]}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(option.value)}
            style={[
              styles.segment,
              fit ? styles.segmentFit : styles.segmentFill,
              { borderRadius: m.seg },
              active && styles.active,
              active && elevation.segment,
            ]}
          >
            <Text variant={active ? m.active : m.text} color={active ? colors.text : colors.textSecondary}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export const SegmentedControl = memo(SegmentedControlBase) as typeof SegmentedControlBase;

const useStyles = makeStyles(({ colors }) => ({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
  },
  fit: {
    alignSelf: 'flex-start',
  },
  segment: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentFill: {
    flex: 1,
  },
  segmentFit: {
    paddingHorizontal: 12,
  },
  active: {
    backgroundColor: colors.surface,
  },
}));
