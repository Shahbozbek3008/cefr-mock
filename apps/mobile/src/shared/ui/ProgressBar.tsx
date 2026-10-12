import { memo } from 'react';
import { View, ViewStyle } from 'react-native';
import { makeStyles, useTheme } from '../theme';

export type ProgressBarProps = {
  value: number;
  height?: number;
  color?: string;
  track?: string;
  marker?: number;
  style?: ViewStyle;
};

export const ProgressBar = memo<ProgressBarProps>(({ value, height = 4, color, track, marker, style }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const clamped = Math.max(0, Math.min(1, value));
  const r = height / 2;

  return (
    <View style={[{ height, borderRadius: r, backgroundColor: track ?? colors.dataTrack }, style]}>
      <View
        style={{ width: `${clamped * 100}%`, height: '100%', borderRadius: r, backgroundColor: color ?? colors.data }}
      />
      {marker !== undefined ? (
        <View style={[styles.marker, { left: `${marker * 100}%`, top: -2, height: height + 4 }]} />
      ) : null}
    </View>
  );
});

ProgressBar.displayName = 'ProgressBar';

const useStyles = makeStyles(({ colors }) => ({
  marker: {
    position: 'absolute',
    width: 1.5,
    borderRadius: 1,
    backgroundColor: colors.borderStrong,
  },
}));
