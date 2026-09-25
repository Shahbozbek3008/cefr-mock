import { memo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useI18n } from '@/shared/i18n';
import { space, useTheme } from '@/shared/theme';
import { Sheet, Text } from '@/shared/ui';

export type ImprovedSheetProps = {
  visible: boolean;
  text: string;
  onClose: () => void;
};

export const ImprovedSheet = memo<ImprovedSheetProps>(({ visible, text, onClose }) => {
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <Sheet visible={visible} onClose={onClose}>
      <View style={styles.intro}>
        <Text variant="titleSheet">{t('aiReview.improvedTitle')}</Text>
        <Text variant="labelRelaxed" color={colors.textSecondary}>
          {t('aiReview.improvedSubtitle')}
        </Text>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text variant="readingSm" color={colors.textReading} style={styles.text}>
          {text}
        </Text>
      </ScrollView>
    </Sheet>
  );
});

ImprovedSheet.displayName = 'ImprovedSheet';

const styles = StyleSheet.create({
  intro: {
    gap: space[2],
    paddingHorizontal: space[1],
  },
  scroll: {
    maxHeight: 420,
  },
  text: {
    paddingHorizontal: space[1],
  },
});
