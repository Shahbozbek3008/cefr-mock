import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useQuery } from '@tanstack/react-query';
import { Pause } from 'lucide-react-native';
import { recordingUrl } from '@/entities/attempt';
import { PlayIcon } from '@/shared/icons';
import { useI18n } from '@/shared/i18n';
import { formatShortClock } from '@/shared/lib';
import { makeStyles, space, useTheme } from '@/shared/theme';
import { ActionSurface, ProgressBar, Text } from '@/shared/ui';

const URL_STALE_MS = 50 * 60 * 1000;

export type RecordingPlayerProps = {
  path: string;
  durationSec: number;
};

export const RecordingPlayer = memo<RecordingPlayerProps>(({ path, durationSec }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const url = useQuery({ queryKey: ['recording', path], queryFn: () => recordingUrl(path), staleTime: URL_STALE_MS });
  const player = useAudioPlayer(url.data ?? null);
  const status = useAudioPlayerStatus(player);
  const duration = status.duration || durationSec;
  const ready = Boolean(url.data) && status.isLoaded;

  const toggle = () => {
    if (status.playing) {
      player.pause();
      return;
    }
    if (status.didJustFinish || status.currentTime >= duration) player.seekTo(0);
    player.play();
  };

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t(status.playing ? 'aiReview.pause' : 'aiReview.play')}
        accessibilityState={{ disabled: !ready }}
        disabled={!ready}
        onPress={toggle}
        style={!ready && styles.disabled}
      >
        <ActionSurface style={styles.play}>
          {status.playing ? (
            <Pause size={14} color={colors.onAction} fill={colors.onAction} strokeWidth={1.6} />
          ) : (
            <PlayIcon size={14} color={colors.onAction} />
          )}
        </ActionSurface>
      </Pressable>
      <ProgressBar value={duration ? status.currentTime / duration : 0} style={styles.track} />
      <Text variant="monoSm" color={colors.textSecondary}>
        {formatShortClock(status.playing || status.currentTime > 0 ? status.currentTime : duration)}
      </Text>
    </View>
  );
});

RecordingPlayer.displayName = 'RecordingPlayer';

const useStyles = makeStyles(() => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  play: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  track: {
    flex: 1,
  },
}));
