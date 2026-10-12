import { memo } from 'react';
import { View, ViewStyle } from 'react-native';
import { makeStyles, useTheme } from '../theme';

export type SegmentProgressProps = {
  total: number;
  completed: number;
  currentProgress?: number;
  height?: number;
  gap?: number;
  doneColor?: string;
  style?: ViewStyle;
};

export const SegmentProgress = memo<SegmentProgressProps>(
  ({ total, completed, currentProgress = 0, height = 3, gap = 3, doneColor, style }) => {
    const styles = useStyles();
    const { colors } = useTheme();
    const fill = doneColor ?? colors.data;
    return (
      <View style={[styles.row, { gap }, style]}>
        {Array.from({ length: total }, (_, index) => {
          const segment = { height, borderRadius: height / 2 };
          if (index < completed) {
            return <View key={index} style={[styles.flex, segment, { backgroundColor: fill }]} />;
          }
          if (index === completed) {
            return (
              <View key={index} style={[styles.flex, segment, styles.current]}>
                <View style={{ width: `${currentProgress * 100}%`, height: '100%', backgroundColor: fill }} />
              </View>
            );
          }
          return <View key={index} style={[styles.flex, segment, styles.pending]} />;
        })}
      </View>
    );
  },
);

SegmentProgress.displayName = 'SegmentProgress';

const useStyles = makeStyles(({ colors }) => ({
  row: {
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
  current: {
    backgroundColor: colors.dataMuted,
    overflow: 'hidden',
  },
  pending: {
    backgroundColor: colors.border,
  },
}));
