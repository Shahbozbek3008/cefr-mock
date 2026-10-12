import { memo } from 'react';
import { View } from 'react-native';
import { makeStyles, radius, space, useTheme } from '../theme';
import { useI18n } from '../i18n';
import { formatClock, useSecondsLeft } from '../lib';
import { Dot } from './Dot';
import { Text } from './Text';

export type TimerTone = 'normal' | 'warning' | 'danger';

export type TimerPillProps = {
  endsAt: number;
  warnAt?: number;
  onExpire?: () => void;
};

const toneFor = (seconds: number, warnAt: number): TimerTone => {
  if (seconds === 0) return 'danger';
  if (seconds <= warnAt) return 'warning';
  return 'normal';
};

export const StaticTimerPill = memo<{ seconds: number; tone: TimerTone }>(({ seconds, tone }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <View
      accessibilityRole="timer"
      accessibilityLabel={t('session.remainingA11y', { time: formatClock(seconds) })}
      style={[styles.pill, styles[tone]]}
    >
      {tone === 'normal' ? <Dot color={colors.data} /> : null}
      {tone === 'warning' ? <Dot color={colors.warning[500]} ring={colors.warning.ring} /> : null}
      <Text
        variant="monoMedium"
        color={{ normal: colors.text, warning: colors.warning.text, danger: colors.error.text }[tone]}
      >
        {formatClock(seconds)}
      </Text>
    </View>
  );
});

StaticTimerPill.displayName = 'StaticTimerPill';

export const TimerPill = memo<TimerPillProps>(({ endsAt, warnAt = 300, onExpire }) => {
  const seconds = useSecondsLeft(endsAt, onExpire);
  return <StaticTimerPill seconds={seconds} tone={toneFor(seconds, warnAt)} />;
});

TimerPill.displayName = 'TimerPill';

const useStyles = makeStyles(({ colors }) => ({
  pill: {
    height: 34,
    paddingHorizontal: space[3],
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  normal: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  warning: {
    backgroundColor: colors.warning.bg,
    borderWidth: 1,
    borderColor: colors.warning.border,
  },
  danger: {
    backgroundColor: colors.error.bg,
  },
}));
