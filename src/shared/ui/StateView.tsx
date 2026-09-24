import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { hitSlop, light, radius, space } from '../theme';
import { Text } from './Text';

export type StateViewProps = {
  tone?: 'empty' | 'error';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const StateView = memo<StateViewProps>(({ tone = 'empty', title, message, actionLabel, onAction }) => (
  <View style={[styles.box, tone === 'error' ? styles.error : styles.empty]}>
    <Text variant="calloutMedium" color={tone === 'error' ? light.error.text : light.text}>
      {title}
    </Text>
    <Text variant="micro" color={light.textSecondary}>
      {message}
    </Text>
    {actionLabel ? (
      <Pressable accessibilityRole="button" hitSlop={hitSlop} onPress={onAction} style={styles.action}>
        <Text variant="captionMedium" color={light.link}>
          {actionLabel}
        </Text>
      </Pressable>
    ) : null}
  </View>
));

StateView.displayName = 'StateView';

const styles = StyleSheet.create({
  box: {
    borderRadius: radius.md,
    padding: space[3],
    gap: space[1],
  },
  empty: {
    backgroundColor: light.bg,
  },
  error: {
    backgroundColor: light.error.bg,
  },
  action: {
    marginTop: space[1],
    alignSelf: 'flex-start',
  },
});
