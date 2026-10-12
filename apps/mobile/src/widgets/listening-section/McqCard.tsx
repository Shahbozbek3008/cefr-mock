import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { McqOptions } from '@/entities/attempt';
import type { McqQuestion } from '@/entities/test';
import { radius, space, useTheme } from '@/shared/theme';
import { Card, Tag, Text } from '@/shared/ui';

export type McqCardProps = {
  question: McqQuestion;
  group?: string;
  current: boolean;
  onAnswer: (id: string) => void;
  onLayout: (id: string, y: number) => void;
};

export const McqCard = memo<McqCardProps>(({ question, group, current, onAnswer, onLayout }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.block} onLayout={(event) => onLayout(question.id, event.nativeEvent.layout.y)}>
      {group ? (
        <Text variant="captionMedium" color={colors.textSecondary} style={styles.group}>
          {group}
        </Text>
      ) : null}
      <Card radius={radius.cardLg} style={styles.card}>
        <View style={styles.tag}>
          <Tag label={`Q${question.number}`} tone={current ? 'lime' : 'neutral'} size="md" mono />
        </View>
        {question.prompt ? <Text variant="labelMedium">{question.prompt}</Text> : null}
        <McqOptions question={question} onAnswer={onAnswer} />
      </Card>
    </View>
  );
});

McqCard.displayName = 'McqCard';

const styles = StyleSheet.create({
  block: {
    gap: space[2],
  },
  group: {
    paddingHorizontal: space[1],
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  tag: {
    flexDirection: 'row',
  },
  card: {
    padding: space[4],
    gap: space[3],
  },
});
