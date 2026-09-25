import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { WritingTask } from '@/entities/test';
import { light, radius, space } from '@/shared/theme';
import { Card, Text } from '@/shared/ui';

export const TaskCard = memo<{ task: WritingTask }>(({ task }) => (
  <Card radius={radius.lg} style={styles.compact}>
    <Text variant="monoNano" color={light.textTertiary} style={styles.label}>
      TASK
    </Text>
    <Text variant="bodySmRelaxed" color={light.textStrong} style={styles.prompt}>
      {task.prompt}
    </Text>
  </Card>
));

TaskCard.displayName = 'TaskCard';

export const TaskBrief = memo<{ task: WritingTask }>(({ task }) => (
  <Card radius={radius.card} style={styles.brief}>
    <Text variant="monoLabel" color={light.textTertiary}>
      {`${task.label} · ${task.kind}`.toUpperCase()}
    </Text>
    <Text variant="lead">{task.prompt}</Text>
    <View style={styles.requirements}>
      <View style={styles.requirement}>
        <Text variant="callout" color={light.textSecondary}>
          Minimal hajm
        </Text>
        <Text variant="monoCallout">{`${task.minWords} so'z`}</Text>
      </View>
      <View style={styles.requirement}>
        <Text variant="callout" color={light.textSecondary}>
          Tavsiya etilgan
        </Text>
        <Text variant="monoCallout">{`${task.targetWords} so'z`}</Text>
      </View>
    </View>
  </Card>
));

TaskBrief.displayName = 'TaskBrief';

const styles = StyleSheet.create({
  compact: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[2.5],
    paddingVertical: space[3],
    paddingHorizontal: space[3.5],
  },
  label: {
    paddingTop: 3,
  },
  prompt: {
    flex: 1,
  },
  brief: {
    padding: space[4],
    gap: space[3],
  },
  requirements: {
    marginTop: space[1],
  },
  requirement: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: light.divider,
  },
});
