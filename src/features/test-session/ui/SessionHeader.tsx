import { ReactNode, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { X } from 'lucide-react-native';
import { light, size, space } from '@/shared/theme';
import { IconButton, SegmentProgress, Text } from '@/shared/ui';

export type SessionHeaderProps = {
  title: string;
  counter?: string;
  subtitle?: string;
  progress?: { total: number; completed: number; current: number };
  timer: ReactNode;
  onClose: () => void;
};

export const SessionHeader = memo<SessionHeaderProps>(({ title, counter, subtitle, progress, timer, onClose }) => (
  <View style={styles.bar}>
    <IconButton accessibilityLabel="Testdan chiqish" onPress={onClose}>
      <X size={17} color={light.textStrong} strokeWidth={1.6} />
    </IconButton>

    <View style={[styles.center, progress && styles.centerProgress]}>
      <View style={styles.titleRow}>
        <Text variant="bodySmMedium">{title}</Text>
        {counter ? (
          <Text variant="monoSm" color={light.textTertiary}>
            {counter}
          </Text>
        ) : null}
      </View>
      {subtitle ? (
        <Text variant="caption" color={light.textSecondary}>
          {subtitle}
        </Text>
      ) : null}
      {progress ? (
        <SegmentProgress total={progress.total} completed={progress.completed} currentProgress={progress.current} />
      ) : null}
    </View>

    {timer}
  </View>
));

SessionHeader.displayName = 'SessionHeader';

const styles = StyleSheet.create({
  bar: {
    height: size.headerBar,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  center: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space[1],
  },
  centerProgress: {
    gap: space[1.5],
  },
});
