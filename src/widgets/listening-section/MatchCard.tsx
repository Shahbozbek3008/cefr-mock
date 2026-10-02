import { memo } from 'react';
import { View } from 'react-native';
import { MatchChips } from '@/entities/attempt';
import type { Choice, Question } from '@/entities/test';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Card, Tag, Text } from '@/shared/ui';

export type MatchCardProps = {
  choices: Choice[];
  questions: Question[];
  currentId: string;
  showChoices: boolean;
  onAnswer: (id: string) => void;
  onLayout: (id: string, y: number) => void;
};

export const MatchCard = memo<MatchCardProps>(({ choices, questions, currentId, showChoices, onAnswer, onLayout }) => {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <>
      {showChoices ? (
        <Card radius={radius.cardLg} style={styles.choices}>
          {choices.map((choice) => (
            <View key={choice.key} style={styles.choice}>
              <Text variant="monoSmMedium" color={colors.textSecondary} style={styles.key}>
                {choice.key}
              </Text>
              <Text variant="label" style={styles.choiceText}>
                {choice.text}
              </Text>
            </View>
          ))}
        </Card>
      ) : null}

      <Card radius={radius.cardLg} style={styles.questions}>
        {questions.map((question, index) => (
          <View
            key={question.id}
            style={[styles.row, index > 0 && styles.divider]}
            onLayout={(event) => onLayout(question.id, event.nativeEvent.layout.y)}
          >
            <View style={styles.prompt}>
              <Tag label={`Q${question.number}`} tone={question.id === currentId ? 'lime' : 'neutral'} size="sm" mono />
              <Text variant="labelMedium" style={styles.promptText}>
                {question.prompt}
              </Text>
            </View>
            <MatchChips questionId={question.id} choices={choices} onAnswer={onAnswer} />
          </View>
        ))}
      </Card>
    </>
  );
});

MatchCard.displayName = 'MatchCard';

const useStyles = makeStyles(({ colors }) => ({
  choices: {
    padding: space[4],
    gap: space[2.5],
  },
  choice: {
    flexDirection: 'row',
    gap: space[3],
  },
  key: {
    width: 14,
    paddingTop: 2,
  },
  choiceText: {
    flex: 1,
  },
  questions: {
    paddingHorizontal: space[4],
    paddingVertical: space[1],
  },
  row: {
    gap: space[2.5],
    paddingVertical: space[3.5],
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  prompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2.5],
  },
  promptText: {
    flex: 1,
  },
}));
