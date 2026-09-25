import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { makeStyles, radius, size, space, useTheme } from '@/shared/theme';
import { Text } from '@/shared/ui';
import { AiTile } from './AiTile';

export const AiReviewButton = memo<{ onPress: () => void }>(({ onPress }) => {
  const styles = useStyles();
  const { colors, elevation } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="AI baho"
      onPress={onPress}
      style={({ pressed }) => [styles.button, elevation.segment, pressed && styles.pressed]}
    >
      <AiTile />
      <View style={styles.body}>
        <Text variant="bodySmMedium">AI baho</Text>
        <Text variant="micro" color={colors.textSecondary} numberOfLines={1}>
          Writing · Speaking
        </Text>
      </View>
    </Pressable>
  );
});

AiReviewButton.displayName = 'AiReviewButton';

const useStyles = makeStyles(({ colors }) => ({
  button: {
    height: size.buttonM,
    borderRadius: radius.button,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
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
}));
