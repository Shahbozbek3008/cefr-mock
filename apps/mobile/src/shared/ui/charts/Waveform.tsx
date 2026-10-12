import { memo } from 'react';
import { View, ViewStyle } from 'react-native';
import { makeStyles, useTheme } from '../../theme';

export type WaveformProps = {
  bars: readonly number[];
  progress: number;
  height?: number;
  color?: string;
  track?: string;
  playhead?: boolean;
  style?: ViewStyle;
};

export const Waveform = memo<WaveformProps>(
  ({ bars, progress, height = 36, color, track, playhead = false, style }) => {
    const styles = useStyles();
    const { colors } = useTheme();
    const fill = color ?? colors.data;
    const rest = track ?? colors.border;
    const filled = Math.round(bars.length * progress);

    return (
      <View style={[styles.row, { height }, style]}>
        {bars.map((bar, index) => (
          <View
            key={index}
            style={[
              styles.bar,
              {
                height: `${Math.max(0.08, Math.min(1, bar)) * 100}%`,
                backgroundColor: index < filled ? fill : rest,
              },
            ]}
          />
        ))}
        {playhead ? <View style={[styles.playhead, { left: `${progress * 100}%` }]} /> : null}
      </View>
    );
  },
);

Waveform.displayName = 'Waveform';

const useStyles = makeStyles(({ colors }) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  bar: {
    flex: 1,
    borderRadius: 2,
  },
  playhead: {
    position: 'absolute',
    top: -4,
    bottom: -4,
    width: 2,
    borderRadius: 1,
    backgroundColor: colors.selectedText,
  },
}));
