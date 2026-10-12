import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { MAX_SCORE, levelThresholds } from '@/shared/lib';
import { palette, space } from '@/shared/theme';
import { Text } from '@/shared/ui';

const bounds = [0, ...levelThresholds.map((t) => t.min), MAX_SCORE];
const segments = bounds.slice(0, -1).map((start, i) => ({ start, end: bounds[i + 1] }));

export const LevelBar = memo<{ score: number }>(({ score }) => {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {segments.map((seg) => {
          const fill = Math.max(0, Math.min(1, (score - seg.start) / (seg.end - seg.start)));
          return (
            <View key={seg.start} style={[styles.segment, { flex: seg.end - seg.start }]}>
              <View style={[styles.fill, { width: `${fill * 100}%` }]} />
            </View>
          );
        })}
        <View style={[styles.marker, { left: `${(score / MAX_SCORE) * 100}%` }]}>
          <View style={styles.knob} />
        </View>
      </View>
      <View style={styles.labels}>
        {segments.map((seg, i) => (
          <View key={seg.start} style={{ flex: seg.end - seg.start }}>
            {i > 0 ? (
              <Text variant="monoNano" color={palette.white.a60}>
                {levelThresholds[i - 1].level}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
});

LevelBar.displayName = 'LevelBar';

const styles = StyleSheet.create({
  container: {
    gap: space[2],
  },
  bar: {
    height: 6,
    flexDirection: 'row',
    gap: 3,
  },
  segment: {
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.white.a20,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: palette.white.a90,
  },
  marker: {
    position: 'absolute',
    top: -7,
    width: 20,
    height: 20,
    marginLeft: -10,
    borderRadius: 10,
    backgroundColor: palette.secondary.ring,
    alignItems: 'center',
    justifyContent: 'center',
  },
  knob: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: palette.neutral.white,
  },
  labels: {
    flexDirection: 'row',
    gap: 3,
  },
});
