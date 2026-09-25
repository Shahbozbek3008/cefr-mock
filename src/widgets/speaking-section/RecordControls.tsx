import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { ArrowRight, Check, Mic, RotateCcw } from 'lucide-react-native';
import { hitSlop, makeStyles, radius, space, useTheme } from '@/shared/theme';
import type { RecorderPhase } from './useAnswerRecorder';

const SIDE = 52;
const MAIN = 80;

export type RecordControlsProps = {
  phase: RecorderPhase;
  onRestart: () => void;
  onRecord: () => void;
  onStop: () => void;
  onNext: () => void;
};

export const RecordControls = memo<RecordControlsProps>(({ phase, onRestart, onRecord, onStop, onNext }) => {
  const styles = useStyles();
  const { colors, elevation } = useTheme();
  const canRestart = phase === 'recording' || phase === 'done';
  const mainDisabled = phase === 'pending' || phase === 'done' || phase === 'denied';

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Qayta yozish"
        disabled={!canRestart}
        hitSlop={hitSlop}
        onPress={onRestart}
        style={[styles.side, elevation.hairline]}
      >
        <RotateCcw size={19} color={canRestart ? colors.textStrong : colors.textTertiary} strokeWidth={1.6} />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={phase === 'recording' ? "Yozishni to'xtatish" : 'Yozishni boshlash'}
        disabled={mainDisabled}
        onPress={phase === 'recording' ? onStop : onRecord}
        style={[styles.main, elevation.record]}
      >
        {phase === 'recording' ? <View style={styles.stop} /> : null}
        {phase === 'done' ? <Check size={28} color={colors.success[500]} strokeWidth={2} /> : null}
        {phase === 'prep' || phase === 'pending' || phase === 'denied' ? (
          <Mic size={28} color={phase === 'prep' ? colors.error[500] : colors.textTertiary} strokeWidth={1.6} />
        ) : null}
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Keyingi savol"
        hitSlop={hitSlop}
        onPress={onNext}
        style={[styles.side, elevation.hairline]}
      >
        <ArrowRight size={19} color={colors.textStrong} strokeWidth={1.6} />
      </Pressable>
    </View>
  );
});

RecordControls.displayName = 'RecordControls';

const useStyles = makeStyles(({ colors }) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[7],
  },
  side: {
    width: SIDE,
    height: SIDE,
    borderRadius: SIDE / 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    width: MAIN,
    height: MAIN,
    borderRadius: MAIN / 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stop: {
    width: 30,
    height: 30,
    borderRadius: radius.segment,
    backgroundColor: colors.error[500],
  },
}));
