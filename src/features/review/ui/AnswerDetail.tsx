import { memo } from 'react';
import { View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import type { AnswerReview, ReviewStatus } from '@/entities/result';
import type { Question } from '@/entities/test';
import { PlayIcon } from '@/shared/icons';
import { formatClock } from '@/shared/lib';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Card, Tag, TagTone, Text } from '@/shared/ui';

const statusTags: Record<ReviewStatus, { label: string; tone: TagTone }> = {
  correct: { label: "To'g'ri", tone: 'success' },
  wrong: { label: 'Xato', tone: 'error' },
  empty: { label: 'Javobsiz', tone: 'neutral' },
};

const answerText = (question: Question, value: string) => {
  if (!value.trim()) return '—';
  if (question.kind !== 'mcq') return value;
  const option = question.options.find((o) => o.key === value);
  return option ? `${option.key} · ${option.text}` : value;
};

const AnswerBox = memo<{ label: string; value: string; tone: 'success' | 'error' | 'neutral'; struck?: boolean }>(
  ({ label, value, tone, struck = false }) => {
    const styles = useStyles();
    const { colors } = useTheme();
    const swatch =
      tone === 'success'
        ? { bg: colors.success.bg, fg: colors.success.text }
        : tone === 'error'
          ? { bg: colors.error.bg, fg: colors.error.text }
          : { bg: colors.bg, fg: colors.textSecondary };
    return (
      <View style={[styles.box, { backgroundColor: swatch.bg }]}>
        <Text variant="micro" color={swatch.fg}>
          {label}
        </Text>
        <Text variant={tone === 'success' ? 'monoMedium' : 'mono'} color={swatch.fg} style={struck && styles.struck}>
          {value}
        </Text>
      </View>
    );
  },
);

AnswerBox.displayName = 'AnswerBox';

export type AnswerDetailProps = {
  item: AnswerReview;
  question: Question;
};

export const AnswerDetail = memo<AnswerDetailProps>(({ item, question }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const tag = statusTags[item.status];

  return (
    <Card level="strong" style={styles.card}>
      <View style={styles.header}>
        <Tag label={`Q${item.number} · ${tag.label}`} tone={tag.tone} size="md" mono />
        {item.audioAt !== undefined ? (
          <View style={styles.audio}>
            <PlayIcon size={12} color={colors.selectedText} />
            <Text variant="captionMedium" color={colors.selectedText}>
              {`${formatClock(item.audioAt)} dan tinglash`}
            </Text>
          </View>
        ) : null}
      </View>

      <Text variant="labelRelaxed">{question.kind === 'gap' ? `${item.prompt} ______` : item.prompt}</Text>

      <View style={styles.answers}>
        {item.status === 'correct' ? (
          <AnswerBox label="Sizning javob" value={answerText(question, item.yourAnswer)} tone="success" />
        ) : (
          <>
            <AnswerBox
              label="Sizning javob"
              value={answerText(question, item.yourAnswer)}
              tone={item.status === 'wrong' ? 'error' : 'neutral'}
              struck={item.status === 'wrong'}
            />
            <AnswerBox label="To'g'ri javob" value={answerText(question, item.correctAnswer)} tone="success" />
          </>
        )}
      </View>

      {item.explanation ? (
        <View style={styles.explanation}>
          <Sparkles size={15} color={colors.data} strokeWidth={1.6} style={styles.sparkles} />
          <Text variant="calloutRelaxed" color={colors.textStrong} style={styles.explanationText}>
            {item.explanation}
          </Text>
        </View>
      ) : null}
    </Card>
  );
});

AnswerDetail.displayName = 'AnswerDetail';

const useStyles = makeStyles(({ colors }) => ({
  card: {
    padding: space[4],
    gap: space[3.5],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  audio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1.5],
  },
  answers: {
    flexDirection: 'row',
    gap: space[2],
  },
  box: {
    flex: 1,
    borderRadius: radius.md,
    paddingVertical: space[2.5],
    paddingHorizontal: space[3],
    gap: space[0.5],
  },
  struck: {
    textDecorationLine: 'line-through',
  },
  explanation: {
    flexDirection: 'row',
    gap: space[2.5],
    paddingTop: space[3],
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  sparkles: {
    marginTop: 2,
  },
  explanationText: {
    flex: 1,
  },
}));
