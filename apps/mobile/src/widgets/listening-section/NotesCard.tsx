import { memo } from 'react';
import { TextInput, View } from 'react-native';
import type { Question } from '@/entities/test';
import { GapInput } from '@/entities/attempt';
import { makeStyles, radius, space } from '@/shared/theme';
import { Card, Text } from '@/shared/ui';

export type NotesCardProps = {
  title: string;
  questions: Question[];
  onFocus: (id: string) => void;
  registerInput: (id: string, input: TextInput | null) => void;
};

export const NotesCard = memo<NotesCardProps>(({ title, questions, onFocus, registerInput }) => {
  const styles = useStyles();

  return (
    <Card radius={radius.cardLg} style={styles.card}>
      <Text variant="labelMedium" style={styles.title}>
        {title}
      </Text>
      {questions.map((q) => (
        <View key={q.id} style={styles.row}>
          <Text variant="label" style={styles.prompt}>
            {q.prompt}
          </Text>
          <GapInput ref={(input) => registerInput(q.id, input)} questionId={q.id} number={q.number} onFocus={onFocus} />
        </View>
      ))}
    </Card>
  );
});

NotesCard.displayName = 'NotesCard';

const useStyles = makeStyles(({ colors }) => ({
  card: {
    paddingVertical: space[1],
    paddingHorizontal: space[4],
  },
  title: {
    paddingTop: space[3.5],
    paddingBottom: space[3],
  },
  row: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  prompt: {
    flex: 1,
  },
}));
