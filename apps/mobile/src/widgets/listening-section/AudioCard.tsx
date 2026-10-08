import { ReactNode, memo, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Lock, RotateCcw } from 'lucide-react-native';
import type { AttemptMode } from '@/entities/attempt';
import type { TKey } from '@/shared/i18n';
import { useI18n } from '@/shared/i18n';
import { formatClock } from '@/shared/lib';
import { hitSlop, makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Card, Dot, Text } from '@/shared/ui';
import { Waveform } from '@/shared/ui/charts';

const bars = [
  0.3, 0.55, 0.4, 0.75, 0.5, 0.9, 0.6, 0.35, 0.7, 1, 0.45, 0.65, 0.4, 0.8, 0.3, 0.55, 0.85, 0.5, 0.35, 0.65, 0.45, 0.25,
  0.6, 0.4, 0.7, 0.3, 0.5, 0.2, 0.45, 0.3,
];

const END_TOLERANCE_SEC = 0.5;
const EXAM_ROUNDS = 2;

type FrameProps = {
  mode: AttemptMode;
  label: TKey;
  active: boolean;
  position: number;
  duration: number;
  progress: number;
  round?: number;
  action?: ReactNode;
};

const Frame = ({ mode, label, active, position, duration, progress, round, action }: FrameProps) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <Card level="strong" radius={radius.hero} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.status}>
          <Dot
            color={active ? colors.data : colors.textTertiary}
            size={8}
            ring={active ? colors.focusRing : undefined}
            ringWidth={4}
          />
          <Text variant="captionMedium" color={active ? colors.selectedText : colors.textSecondary}>
            {round ? `${t(label)} · ${t('listening.round', { count: round })}` : t(label)}
          </Text>
        </View>
        <View style={styles.badge}>
          {mode === 'exam' ? <Lock size={11} color={colors.textSecondary} strokeWidth={2.2} /> : null}
          <Text variant="microMedium" color={colors.textSecondary}>
            {t(mode === 'exam' ? 'listening.realMode' : 'listening.practiceMode')}
          </Text>
        </View>
      </View>

      <View style={styles.time}>
        <Text variant="monoTimer">{formatClock(position)}</Text>
        <Text variant="mono" color={colors.textTertiary}>
          {`/ ${formatClock(duration)}`}
        </Text>
      </View>

      <Waveform bars={bars} progress={progress} playhead />

      <View style={styles.footer}>
        <Text variant="caption" color={colors.textSecondary} style={styles.note}>
          {t(mode === 'exam' ? 'listening.onceNote' : 'listening.practiceNote')}
        </Text>
        {action}
      </View>
    </Card>
  );
};

export type AudioCardProps = {
  uri: string;
  durationSec: number;
  mode: AttemptMode;
  played: boolean;
  onStart: () => void;
  onEnded: () => void;
};

const Player = ({ uri, durationSec, mode, onStart, onEnded }: Omit<AudioCardProps, 'played'>) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const player = useAudioPlayer({ uri });
  const status = useAudioPlayerStatus(player);
  const started = useRef(false);
  const [round, setRound] = useState(1);
  const startRef = useRef(onStart);
  const endedRef = useRef(onEnded);
  startRef.current = onStart;
  endedRef.current = onEnded;

  const duration = status.duration || durationSec;
  const position = Math.min(status.currentTime, duration);
  const lastRound = mode !== 'exam' || round === EXAM_ROUNDS;
  const finished = lastRound && started.current && !status.playing && position >= duration - END_TOLERANCE_SEC;
  const label: TKey = !status.isLoaded ? 'common.loading' : finished ? 'listening.ended' : 'listening.playing';

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false }).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!status.isLoaded || started.current) return;
    started.current = true;
    startRef.current();
    player.play();
  }, [player, status.isLoaded]);

  useEffect(() => {
    if (!status.didJustFinish) return;
    if (lastRound) {
      endedRef.current();
      return;
    }
    setRound((current) => current + 1);
    player.seekTo(0);
    player.play();
  }, [lastRound, player, status.didJustFinish]);

  const replay = () => {
    player.seekTo(0);
    player.play();
  };

  const action =
    mode === 'practice' && finished ? (
      <Pressable accessibilityRole="button" hitSlop={hitSlop} onPress={replay} style={styles.replay}>
        <RotateCcw size={14} color={colors.link} strokeWidth={1.8} />
        <Text variant="calloutMedium" color={colors.link}>
          {t('listening.replay')}
        </Text>
      </Pressable>
    ) : undefined;

  return (
    <Frame
      mode={mode}
      label={label}
      active={status.isLoaded && !finished}
      position={position}
      duration={duration}
      progress={duration > 0 ? position / duration : 0}
      round={mode === 'exam' ? round : undefined}
      action={action}
    />
  );
};

export const AudioCard = memo<AudioCardProps>(({ played, ...props }) => {
  const [playedBefore] = useState(played);
  return props.mode === 'exam' && playedBefore ? (
    <Frame
      mode="exam"
      label="listening.ended"
      active={false}
      position={props.durationSec}
      duration={props.durationSec}
      progress={1}
    />
  ) : (
    <Player {...props} />
  );
});

AudioCard.displayName = 'AudioCard';

const useStyles = makeStyles(({ colors }) => ({
  card: {
    padding: space[4.5],
    gap: space[4],
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
  badge: {
    height: 24,
    paddingHorizontal: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  time: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space[2],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  note: {
    flex: 1,
  },
  replay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1.5],
  },
}));
