import { memo, useMemo } from 'react';
import { View } from 'react-native';
import type { SpeakingQuestion } from '@/entities/test';
import { formatClock } from '@/shared/lib';
import { Colors, makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Card, Dot, Text } from '@/shared/ui';
import { Waveform } from '@/shared/ui/charts';
import type { RecorderPhase } from './useAnswerRecorder';

const idleBars = [
  0.3, 0.55, 0.8, 0.45, 0.95, 0.6, 0.35, 0.7, 1, 0.5, 0.4, 0.85, 0.65, 0.3, 0.75, 0.55, 0.9, 0.45, 0.6, 0.35, 0.8, 0.5,
  0.7, 0.4,
];

const statusFor = (colors: Colors, phase: RecorderPhase): { label: string; dot: string; text: string; ring?: string } =>
  ({
    pending: { label: 'Mikrofon tayyorlanmoqda', dot: colors.textTertiary, text: colors.textSecondary },
    prep: { label: 'Tayyorlaning', dot: colors.data, text: colors.selectedText, ring: colors.focusRing },
    recording: { label: 'Yozilmoqda', dot: colors.error[500], text: colors.error.text, ring: colors.error.ring },
    done: { label: 'Yozib olindi', dot: colors.success[500], text: colors.success.text },
    denied: { label: "Ruxsat yo'q", dot: colors.error[500], text: colors.error.text },
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
  const status = statusFor(colors, phase);
  const wave = useMemo(() => idleBars.map((idle, i) => bars[i] ?? idle), [bars]);
  const prepared = phase === 'recording' || phase === 'done';

  return (
    <Card level="raised" radius={radius.cardLg} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.status}>
          <Dot color={status.dot} size={8} ring={status.ring} ringWidth={4} />
          <Text variant="calloutMedium" color={status.text}>
            {status.label}
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
            {`Tayyorlanish ${question.prepSec}s${prepared ? ' ✓' : ''}`}
          </Text>
        </View>
        <View style={styles.chip}>
          <Text variant="monoXs" color={colors.textSecondary}>
            {`Javob ${question.answerSec}s`}
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
