import { memo, useMemo } from 'react';
import { View } from 'react-native';
import type { SpeakingQuestion } from '@/entities/test';
import { useI18n } from '@/shared/i18n';
import { formatClock } from '@/shared/lib';
import { Colors, makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Card, Dot, Text } from '@/shared/ui';
import { Waveform } from '@/shared/ui/charts';
import type { RecorderPhase } from './useAnswerRecorder';

const idleBars = [
  0.3, 0.55, 0.8, 0.45, 0.95, 0.6, 0.35, 0.7, 1, 0.5, 0.4, 0.85, 0.65, 0.3, 0.75, 0.55, 0.9, 0.45, 0.6, 0.35, 0.8, 0.5,
  0.7, 0.4,
];

const statusFor = (colors: Colors, phase: RecorderPhase): { dot: string; text: string; ring?: string } =>
  ({
    pending: { dot: colors.textTertiary, text: colors.textSecondary },
    prep: { dot: colors.data, text: colors.selectedText, ring: colors.focusRing },
    recording: { dot: colors.error[500], text: colors.error.text, ring: colors.error.ring },
    done: { dot: colors.success[500], text: colors.success.text },
    denied: { dot: colors.error[500], text: colors.error.text },
  })[phase];

export type RecorderCardProps = {
  question: SpeakingQuestion;
  phase: RecorderPhase;
  elapsed: number;
  bars: number[];
};

export const RecorderCard = memo<RecorderCardProps>(({ question, phase, elapsed, bars }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const status = statusFor(colors, phase);
  const wave = useMemo(() => idleBars.map((idle, i) => bars[i] ?? idle), [bars]);
  const prepared = phase === 'recording' || phase === 'done';

  return (
    <Card level="raised" radius={radius.cardLg} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.status}>
          <Dot color={status.dot} size={8} ring={status.ring} ringWidth={4} />
          <Text variant="calloutMedium" color={status.text}>
            {t(`speaking.status.${phase}`)}
          </Text>
        </View>
        <Text variant="monoCallout" color={colors.textSecondary}>
          {`${formatClock(elapsed)} / ${formatClock(question.answerSec)}`}
        </Text>
      </View>

      <Waveform bars={wave} progress={elapsed / question.answerSec} height={44} />

      <View style={styles.chips}>
        <View style={styles.chip}>
          <Text variant="monoXs" color={colors.textSecondary}>
            {`${t('speaking.prepChip', { count: question.prepSec })}${prepared ? ' ✓' : ''}`}
          </Text>
        </View>
        <View style={styles.chip}>
          <Text variant="monoXs" color={colors.textSecondary}>
            {t('speaking.answerChip', { count: question.answerSec })}
          </Text>
        </View>
      </View>
    </Card>
  );
});

RecorderCard.displayName = 'RecorderCard';

const useStyles = makeStyles(({ colors }) => ({
  card: {
    padding: space[4.5],
    gap: space[3.5],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  chips: {
    flexDirection: 'row',
    gap: space[1.5],
  },
  chip: {
    height: 24,
    paddingHorizontal: space[2],
    borderRadius: radius.chip,
    backgroundColor: colors.bg,
    justifyContent: 'center',
  },
}));
