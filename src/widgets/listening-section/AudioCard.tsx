import { memo } from 'react';
import { View } from 'react-native';
import { Lock } from 'lucide-react-native';
import { useI18n } from '@/shared/i18n';
import { formatClock, usePlayback } from '@/shared/lib';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Card, Dot, Text } from '@/shared/ui';
import { Waveform } from '@/shared/ui/charts';

const bars = [
  0.3, 0.55, 0.4, 0.75, 0.5, 0.9, 0.6, 0.35, 0.7, 1, 0.45, 0.65, 0.4, 0.8, 0.3, 0.55, 0.85, 0.5, 0.35, 0.65, 0.45, 0.25,
  0.6, 0.4, 0.7, 0.3, 0.5, 0.2, 0.45, 0.3,
];

export type AudioCardProps = {
  durationSec: number;
  onEnded: () => void;
};

export const AudioCard = memo<AudioCardProps>(({ durationSec, onEnded }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const { position, playing, progress } = usePlayback(durationSec, { autoPlay: true, onEnd: onEnded });

  return (
    <Card level="strong" radius={radius.hero} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.status}>
          <Dot
            color={playing ? colors.data : colors.textTertiary}
            size={8}
            ring={playing ? colors.focusRing : undefined}
            ringWidth={4}
          />
          <Text variant="captionMedium" color={playing ? colors.selectedText : colors.textSecondary}>
            {playing ? t('listening.playing') : t('listening.ended')}
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
          {`/ ${formatClock(durationSec)}`}
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
