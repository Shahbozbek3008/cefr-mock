import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Pause } from 'lucide-react-native';
import { PlayIcon } from '@/shared/icons';
import { formatShortClock, usePlayback } from '@/shared/lib';
import { light, space } from '@/shared/theme';
import { ActionSurface, Card, Text } from '@/shared/ui';
import { Waveform } from '@/shared/ui/charts';

export type PlaybackCardProps = {
  durationSec: number;
  bars: number[];
};

export const PlaybackCard = memo<PlaybackCardProps>(({ durationSec, bars }) => {
  const { position, playing, progress, toggle } = usePlayback(durationSec);

  return (
    <Card style={styles.card}>
      <Pressable accessibilityRole="button" accessibilityLabel={playing ? "To'xtatish" : 'Tinglash'} onPress={toggle}>
        <ActionSurface style={styles.play}>
          {playing ? (
            <Pause size={14} color={light.onAction} fill={light.onAction} strokeWidth={1.6} />
          ) : (
            <PlayIcon size={14} color={light.onAction} />
          )}
        </ActionSurface>
      </Pressable>
      <Waveform bars={bars} progress={progress} height={32} style={styles.wave} />
      <Text variant="monoSm" color={light.textSecondary}>
        {formatShortClock(playing || position > 0 ? position : durationSec)}
      </Text>
    </Card>
  );
});

PlaybackCard.displayName = 'PlaybackCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingVertical: space[3],
    paddingHorizontal: space[3.5],
  },
  play: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wave: {
    flex: 1,
  },
});
