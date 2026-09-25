import { memo } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import type { AnswerReview, ReviewStatus } from '@/entities/result';
import { light, radius, space } from '@/shared/theme';
import { Card, Text } from '@/shared/ui';

const COLUMNS = 6;

const tones: Record<ReviewStatus, { bg: string; fg: string }> = {
  correct: { bg: light.success.bg, fg: light.success.text },
  wrong: { bg: light.error.bg, fg: light.error.text },
  empty: { bg: light.surfaceMuted, fg: light.textTertiary },
};

export type ReviewGridProps = {
  items: AnswerReview[];
  selectedId: string;
  onSelect: (id: string) => void;
};

const chunk = <T,>(list: T[], length: number) =>
  Array.from({ length: Math.ceil(list.length / length) }, (_, i) => list.slice(i * length, (i + 1) * length));

export const ReviewGrid = memo<ReviewGridProps>(({ items, selectedId, onSelect }) => (
  <Card style={styles.card}>
    {chunk(items, COLUMNS).map((row) => (
      <View key={row[0].questionId} style={styles.row}>
        {row.map((item) => {
          const tone = tones[item.status];
          const selected: ViewStyle | undefined =
            item.questionId === selectedId ? { borderWidth: 1.5, borderColor: tone.fg } : undefined;
          return (
            <Pressable
              key={item.questionId}
              accessibilityRole="button"
              accessibilityLabel={`Savol ${item.number}`}
              accessibilityState={{ selected: Boolean(selected) }}
              onPress={() => onSelect(item.questionId)}
              style={[styles.cell, { backgroundColor: tone.bg }, selected]}
            >
              <Text variant="monoSm" color={tone.fg}>
                {item.number}
              </Text>
            </Pressable>
          );
        })}
        {Array.from({ length: COLUMNS - row.length }, (_, i) => (
          <View key={i} style={styles.spacer} />
        ))}
      </View>
    ))}
  </Card>
));

ReviewGrid.displayName = 'ReviewGrid';

const styles = StyleSheet.create({
  card: {
    padding: space[3.5],
    gap: space[1.5],
  },
  row: {
    flexDirection: 'row',
    gap: space[1.5],
  },
  cell: {
    flex: 1,
    height: 40,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    flex: 1,
  },
});
