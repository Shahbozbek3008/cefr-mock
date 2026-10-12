import { memo, useState } from 'react';
import { Pressable, View } from 'react-native';
import type { SpeakingAnswer } from '@/entities/result';
import { useI18n } from '@/shared/i18n';
import { hitSlop, makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Card, Text } from '@/shared/ui';
import { MarkedText } from './MarkedText';
import { RecordingPlayer } from './RecordingPlayer';

export const SpeakingAnswerCard = memo<{ answer: SpeakingAnswer }>(({ answer }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const [sampleOpen, setSampleOpen] = useState(false);

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
      {answer.sample ? (
        <View style={styles.sample}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: sampleOpen }}
            hitSlop={hitSlop}
            onPress={() => setSampleOpen((open) => !open)}
          >
            <Text variant="captionMedium" color={colors.link}>
              {t(sampleOpen ? 'aiReview.sampleHide' : 'aiReview.sampleShow')}
            </Text>
          </Pressable>
          {sampleOpen ? (
            <Text variant="calloutRelaxed" color={colors.textReading} style={styles.sampleText}>
              {answer.sample}
            </Text>
          ) : null}
        </View>
      ) : null}
    </Card>
  );
});

SpeakingAnswerCard.displayName = 'SpeakingAnswerCard';

const useStyles = makeStyles(({ colors }) => ({
  sample: {
    gap: space[2.5],
    paddingTop: space[3],
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  sampleText: {
    backgroundColor: colors.selectedBg,
    borderRadius: radius.md,
    padding: space[3],
  },
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
