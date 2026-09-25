import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { elevation, light, radius, size, space } from '@/shared/theme';
import { Text } from '@/shared/ui';
import { AiTile } from './AiTile';

export const AiReviewButton = memo<{ onPress: () => void }>(({ onPress }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel="AI baho"
    onPress={onPress}
    style={({ pressed }) => [styles.button, elevation.segment, pressed && styles.pressed]}
  >
    <AiTile />
    <View style={styles.body}>
      <Text variant="bodySmMedium">AI baho</Text>
      <Text variant="micro" color={light.textSecondary} numberOfLines={1}>
        Writing · Speaking
      </Text>
    </View>
  </Pressable>
));

AiReviewButton.displayName = 'AiReviewButton';

const styles = StyleSheet.create({
  button: {
    height: size.buttonM,
    borderRadius: radius.button,
    backgroundColor: light.surface,
    borderWidth: 1,
    borderColor: light.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2.5],
    paddingLeft: space[2],
    paddingRight: space[3],
  },
  body: {
    flex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
});
