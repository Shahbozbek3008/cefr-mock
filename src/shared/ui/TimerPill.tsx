import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { light, radius, space } from '../theme';
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

const textColor: Record<TimerTone, string> = {
  normal: light.text,
  warning: light.warning.text,
  danger: light.error.text,
};

export const StaticTimerPill = memo<{ seconds: number; tone: TimerTone }>(({ seconds, tone }) => (
  <View
    accessibilityRole="timer"
    accessibilityLabel={`Qolgan vaqt ${formatClock(seconds)}`}
    style={[styles.pill, styles[tone]]}
  >
    {tone === 'normal' ? <Dot color={light.data} /> : null}
    {tone === 'warning' ? <Dot color={light.warning[500]} ring={light.warning.ring} /> : null}
    <Text variant="monoMedium" color={textColor[tone]}>
      {formatClock(seconds)}
    </Text>
  </View>
));

StaticTimerPill.displayName = 'StaticTimerPill';

export const TimerPill = memo<TimerPillProps>(({ endsAt, warnAt = 300, onExpire }) => {
  const seconds = useSecondsLeft(endsAt, onExpire);
  return <StaticTimerPill seconds={seconds} tone={toneFor(seconds, warnAt)} />;
});

TimerPill.displayName = 'TimerPill';

const styles = StyleSheet.create({
  pill: {
    height: 34,
    paddingHorizontal: space[3],
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  normal: {
    backgroundColor: light.surface,
    borderWidth: 1,
    borderColor: light.hairline,
  },
  warning: {
    backgroundColor: light.warning.bg,
    borderWidth: 1,
    borderColor: light.warning.border,
  },
  danger: {
    backgroundColor: light.error.bg,
  },
});
