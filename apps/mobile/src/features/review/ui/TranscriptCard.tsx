import { memo, useState } from 'react';
import { Pressable, View } from 'react-native';
import type { PartTranscript, TranscriptLine } from '@/entities/test';
import { useI18n } from '@/shared/i18n';
import type { TKey } from '@/shared/i18n';
import { hitSlop, makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Card, Text } from '@/shared/ui';

export type TranscriptCardProps = {
  transcript: PartTranscript;
  questionNumber: number;
};

const voiceKeys: Record<string, TKey> = {
  narrator: 'review.voices.narrator',
  woman: 'review.voices.woman',
  man: 'review.voices.man',
  woman2: 'review.voices.woman2',
  man2: 'review.voices.man2',
  woman3: 'review.voices.woman3',
  man3: 'review.voices.man3',
};

const segmentOf = (lines: TranscriptLine[], questionNumber: number) => {
  const start = lines.findIndex((line) => line.question === questionNumber);
  if (start < 0) return { start: 0, end: lines.length };
  const next = lines.findIndex(
    (line, index) => index > start && line.question !== undefined && line.question !== questionNumber,
  );
  return { start, end: next < 0 ? lines.length : next };
};

export const TranscriptCard = memo<TranscriptCardProps>(({ transcript, questionNumber }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const { start, end } = segmentOf(transcript.lines, questionNumber);
  const visible = expanded
    ? transcript.lines.map((line, index) => ({ line, index }))
    : transcript.lines.slice(start, end).map((line, offset) => ({ line, index: start + offset }));

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="captionMedium" color={colors.textSecondary}>
          {t('review.transcript')}
        </Text>
        <Pressable accessibilityRole="button" hitSlop={hitSlop} onPress={() => setExpanded((value) => !value)}>
          <Text variant="captionMedium" color={colors.link}>
            {t(expanded ? 'review.transcriptQuestion' : 'review.transcriptFull')}
          </Text>
        </Pressable>
      </View>

      {visible.map(({ line, index }) => {
        const active = index >= start && index < end;
        return (
          <View key={index} style={[styles.line, expanded && active && styles.active]}>
            <Text variant="micro" color={colors.textTertiary}>
              {t(voiceKeys[line.voice] ?? 'review.voices.narrator')}
            </Text>
            <Text variant="calloutRelaxed" color={active ? colors.text : colors.textSecondary}>
              {line.text}
            </Text>
          </View>
        );
      })}
    </Card>
  );
});

TranscriptCard.displayName = 'TranscriptCard';

const useStyles = makeStyles(({ colors }) => ({
  card: {
    padding: space[4],
    gap: space[3],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  line: {
    gap: space[0.5],
  },
  active: {
    backgroundColor: colors.selectedBg,
    borderRadius: radius.sm,
    padding: space[2],
    marginHorizontal: -space[2],
  },
}));
