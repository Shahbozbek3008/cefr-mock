import { memo, useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Sparkles } from 'lucide-react-native';
import { useI18n } from '@/shared/i18n';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Card, Text } from '@/shared/ui';

const PULSE_MS = 900;

export const AiPendingCard = memo(() => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const pulse = useSharedValue(1);

  useEffect(() => {
    const easing = Easing.inOut(Easing.quad);
    pulse.value = withRepeat(
      withSequence(withTiming(0.45, { duration: PULSE_MS, easing }), withTiming(1, { duration: PULSE_MS, easing })),
      -1,
    );
  }, [pulse]);

  const iconStyle = useAnimatedStyle(() => ({ opacity: pulse.value, transform: [{ scale: 0.9 + pulse.value * 0.1 }] }));

  return (
    <Card level="raised" style={styles.card}>
      <View style={styles.tile}>
        <Animated.View style={iconStyle}>
          <Sparkles size={20} color={colors.selectedText} strokeWidth={1.7} />
        </Animated.View>
      </View>
      <View style={styles.copy}>
        <Text variant="bodySmMedium">{t('aiReview.checkingTitle')}</Text>
        <Text variant="callout" color={colors.textSecondary}>
          {t('aiReview.checkingMessage')}
        </Text>
      </View>
    </Card>
  );
});

AiPendingCard.displayName = 'AiPendingCard';

const useStyles = makeStyles(({ colors }) => ({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3.5],
    padding: space[4],
  },
  tile: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.selectedBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: space[0.5],
  },
}));
