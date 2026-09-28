import { memo, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Lock } from 'lucide-react-native';
import { useI18n } from '@/shared/i18n';
import { formatClock } from '@/shared/lib';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Card, Dot, Text } from '@/shared/ui';
import { Waveform } from '@/shared/ui/charts';

const bars = [
  0.3, 0.55, 0.4, 0.75, 0.5, 0.9, 0.6, 0.35, 0.7, 1, 0.45, 0.65, 0.4, 0.8, 0.3, 0.55, 0.85, 0.5, 0.35, 0.65, 0.45, 0.25,
  0.6, 0.4, 0.7, 0.3, 0.5, 0.2, 0.45, 0.3,
];

export type AudioCardProps = {
  uri: string;
  durationSec: number;
  onEnded: () => void;
};

export const AudioCard = memo<AudioCardProps>(({ uri, durationSec, onEnded }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const player = useAudioPlayer({ uri });
  const status = useAudioPlayerStatus(player);
  const started = useRef(false);
  const endedRef = useRef(onEnded);
  endedRef.current = onEnded;

  const duration = status.duration || durationSec;
  const position = Math.min(status.currentTime, duration);
  const progress = duration > 0 ? position / duration : 0;
  const finished = started.current && !status.playing && position >= duration - 0.5;
  const active = status.isLoaded && !finished;
  const label = !status.isLoaded ? 'common.loading' : finished ? 'listening.ended' : 'listening.playing';

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false }).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!status.isLoaded || started.current) return;
    started.current = true;
    player.play();
  }, [player, status.isLoaded]);

  useEffect(() => {
    if (status.didJustFinish) endedRef.current();
  }, [status.didJustFinish]);

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
            {t(label)}
          </Text>
        </View>
        <View style={styles.lock}>
          <Lock size={11} color={colors.textSecondary} strokeWidth={2.2} />
          <Text variant="microMedium" color={colors.textSecondary}>
            {t('listening.realMode')}
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

      <Text variant="caption" color={colors.textSecondary}>
        {t('listening.onceNote')}
      </Text>
    </Card>
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
  lock: {
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
}));
