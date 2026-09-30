import { memo, useEffect } from 'react';
import { Pressable } from 'react-native';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Pause } from 'lucide-react-native';
import { PlayIcon } from '@/shared/icons';
import { useI18n } from '@/shared/i18n';
import { formatClock } from '@/shared/lib';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Text } from '@/shared/ui';

export type AudioClipProps = {
  uri: string;
  startSec: number;
  endSec: number;
};

export const AudioClip = memo<AudioClipProps>(({ uri, startSec, endSec }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const player = useAudioPlayer({ uri });
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false }).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (status.playing && status.currentTime >= endSec) player.pause();
  }, [endSec, player, status.currentTime, status.playing]);

  const toggle = async () => {
    if (status.playing) {
      player.pause();
      return;
    }
    await player.seekTo(startSec);
    player.play();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('mistakes.listen')}
      disabled={!status.isLoaded}
      onPress={toggle}
      style={({ pressed }) => [styles.clip, pressed && styles.pressed]}
    >
      {status.playing ? (
        <Pause size={14} color={colors.selectedText} fill={colors.selectedText} strokeWidth={0} />
      ) : (
        <PlayIcon size={14} color={colors.selectedText} />
      )}
      <Text variant="bodySmMedium" color={colors.selectedText} style={styles.label}>
        {t(status.isLoaded ? 'mistakes.listen' : 'common.loading')}
      </Text>
      <Text variant="monoXs" color={colors.selectedText}>
        {`${formatClock(startSec)}–${formatClock(endSec)}`}
      </Text>
    </Pressable>
  );
});

AudioClip.displayName = 'AudioClip';

const useStyles = makeStyles(({ colors }) => ({
  clip: {
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: colors.selectedBg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2.5],
    paddingHorizontal: space[4],
  },
  label: {
    flex: 1,
  },
  pressed: {
    opacity: 0.6,
  },
}));
