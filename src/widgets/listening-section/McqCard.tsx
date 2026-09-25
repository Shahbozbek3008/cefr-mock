import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { McqOptions } from '@/entities/attempt';
import type { McqQuestion } from '@/entities/test';
import { radius, space } from '@/shared/theme';
import { Card, Tag, Text } from '@/shared/ui';

export type McqCardProps = {
  question: McqQuestion;
  current: boolean;
  onAnswer: (id: string) => void;
  onLayout: (id: string, y: number) => void;
};

export const McqCard = memo<McqCardProps>(({ question, current, onAnswer, onLayout }) => {
  return (
    <Card
      radius={radius.cardLg}
      style={styles.card}
      onLayout={(event) => onLayout(question.id, event.nativeEvent.layout.y)}
    >
      <Tag label={`Q${question.number}`} tone={current ? 'lime' : 'neutral'} size="md" mono />
      <Text variant="labelMedium">{question.prompt}</Text>
      <McqOptions question={question} onAnswer={onAnswer} />
    </Card>
  );
});

McqCard.displayName = 'McqCard';

const styles = StyleSheet.create({
  card: {
    padding: space[4],
    gap: space[3],
  },
});
