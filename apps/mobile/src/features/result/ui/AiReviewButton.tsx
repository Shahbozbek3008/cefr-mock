import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { useI18n } from '@/shared/i18n';
import { makeStyles, radius, size, space, useTheme } from '@/shared/theme';
import { Text } from '@/shared/ui';
import { AiTile } from './AiTile';

export const AiReviewButton = memo<{ onPress: () => void }>(({ onPress }) => {
  const styles = useStyles();
  const { colors, elevation } = useTheme();
  const { t } = useI18n();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('result.aiScore')}
      onPress={onPress}
      style={({ pressed }) => [styles.button, elevation.segment, pressed && styles.pressed]}
    >
      <AiTile />
      <View style={styles.body}>
        <Text variant="bodySmMedium">{t('result.aiScore')}</Text>
        <Text variant="micro" color={colors.textSecondary} numberOfLines={1}>
          {t('result.aiScoreSections')}
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
