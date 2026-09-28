import { memo } from 'react';
import { View } from 'react-native';
import type { SpeakingAnswer } from '@/entities/result';
import { useI18n } from '@/shared/i18n';
import { makeStyles, space, useTheme } from '@/shared/theme';
import { Card, Text } from '@/shared/ui';
import { MarkedText } from './MarkedText';
import { RecordingPlayer } from './RecordingPlayer';

export const SpeakingAnswerCard = memo<{ answer: SpeakingAnswer }>(({ answer }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="bodySmMedium">{answer.part}</Text>
        <Text variant="monoXs" color={colors.textTertiary}>
          {t('aiReview.transcriptMeta', { words: answer.words, wpm: answer.wpm })}
        </Text>
      </View>
      <Text variant="callout" color={colors.textSecondary}>
        {answer.prompt}
      </Text>
      <RecordingPlayer path={answer.path} durationSec={answer.durationSec} />
      <MarkedText segments={answer.segments} grammarTone="warning" />
    </Card>
  );
});

SpeakingAnswerCard.displayName = 'SpeakingAnswerCard';

const useStyles = makeStyles(() => ({
  card: {
    padding: space[4],
    gap: space[3],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));
