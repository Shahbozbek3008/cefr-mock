import { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { light } from '../theme';

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
  ({
    total,
    completed,
    currentProgress = 0,
    height = 3,
    gap = 3,
    doneColor = light.data,
    style,
  }) => (
    <View style={[styles.row, { gap }, style]}>
      {Array.from({ length: total }, (_, index) => {
        const segment = { height, borderRadius: height / 2 };
        if (index < completed) {
          return <View key={index} style={[styles.flex, segment, { backgroundColor: doneColor }]} />;
        }
        if (index === completed) {
          return (
            <View key={index} style={[styles.flex, segment, styles.current]}>
              <View style={{ width: `${currentProgress * 100}%`, height: '100%', backgroundColor: doneColor }} />
            </View>
          );
        }
        return <View key={index} style={[styles.flex, segment, styles.pending]} />;
      })}
    </View>
  ),
);

SegmentProgress.displayName = 'SegmentProgress';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
  current: {
    backgroundColor: light.dataMuted,
    overflow: 'hidden',
  },
  pending: {
    backgroundColor: light.border,
  },
});
