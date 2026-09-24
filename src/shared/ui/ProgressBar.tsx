import { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { light } from '../theme';

export type ProgressBarProps = {
  value: number;
  height?: number;
  color?: string;
  track?: string;
  marker?: number;
  style?: ViewStyle;
};

export const ProgressBar = memo<ProgressBarProps>(
  ({ value, height = 4, color = light.data, track = light.dataTrack, marker, style }) => {
    const clamped = Math.max(0, Math.min(1, value));
    const r = height / 2;

    return (
      <View style={[{ height, borderRadius: r, backgroundColor: track }, style]}>
        <View style={{ width: `${clamped * 100}%`, height: '100%', borderRadius: r, backgroundColor: color }} />
        {marker !== undefined ? (
          <View style={[styles.marker, { left: `${marker * 100}%`, top: -2, height: height + 4 }]} />
        ) : null}
      </View>
    );
  },
);

ProgressBar.displayName = 'ProgressBar';

const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    width: 1.5,
    borderRadius: 1,
    backgroundColor: light.borderStrong,
  },
});
