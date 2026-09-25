import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { SpeakingQuestion } from '@/entities/test';
import { formatClock } from '@/shared/lib';
import { light, radius, space } from '@/shared/theme';
import { Card, Dot, Text } from '@/shared/ui';
import { Waveform } from '@/shared/ui/charts';
import type { RecorderPhase } from './useAnswerRecorder';

const idleBars = [
  0.3, 0.55, 0.8, 0.45, 0.95, 0.6, 0.35, 0.7, 1, 0.5, 0.4, 0.85, 0.65, 0.3, 0.75, 0.55, 0.9, 0.45, 0.6, 0.35, 0.8, 0.5,
  0.7, 0.4,
];

const statuses: Record<RecorderPhase, { label: string; color: string; ring?: string }> = {
  pending: { label: 'Mikrofon tayyorlanmoqda', color: light.textTertiary },
  prep: { label: 'Tayyorlaning', color: light.data, ring: light.focusRing },
  recording: { label: 'Yozilmoqda', color: light.error[500], ring: light.error.ring },
  done: { label: 'Yozib olindi', color: light.success[500] },
  denied: { label: "Ruxsat yo'q", color: light.error[500] },
};

const labelColors: Record<RecorderPhase, string> = {
  pending: light.textSecondary,
  prep: light.selectedText,
  recording: light.error.text,
  done: light.success.text,
  denied: light.error.text,
};

export type RecorderCardProps = {
  question: SpeakingQuestion;
  phase: RecorderPhase;
  elapsed: number;
  bars: number[];
};

export const RecorderCard = memo<RecorderCardProps>(({ question, phase, elapsed, bars }) => {
  const status = statuses[phase];
  const wave = useMemo(() => idleBars.map((idle, i) => bars[i] ?? idle), [bars]);
  const prepared = phase === 'recording' || phase === 'done';

  return (
    <Card level="raised" radius={radius.cardLg} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.status}>
          <Dot color={status.color} size={8} ring={status.ring} ringWidth={4} />
          <Text variant="calloutMedium" color={labelColors[phase]}>
            {status.label}
          </Text>
        </View>
        <Text variant="monoCallout" color={light.textSecondary}>
          {`${formatClock(elapsed)} / ${formatClock(question.answerSec)}`}
        </Text>
      </View>

      <Waveform bars={wave} progress={elapsed / question.answerSec} height={44} />

      <View style={styles.chips}>
        <View style={styles.chip}>
          <Text variant="monoXs" color={light.textSecondary}>
            {`Tayyorlanish ${question.prepSec}s${prepared ? ' ✓' : ''}`}
          </Text>
        </View>
        <View style={styles.chip}>
          <Text variant="monoXs" color={light.textSecondary}>
            {`Javob ${question.answerSec}s`}
          </Text>
        </View>
      </View>
    </Card>
  );
});

RecorderCard.displayName = 'RecorderCard';

const styles = StyleSheet.create({
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
    backgroundColor: light.bg,
    justifyContent: 'center',
  },
});
