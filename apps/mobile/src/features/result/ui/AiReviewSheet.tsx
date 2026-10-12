import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Mic, PenLine } from 'lucide-react-native';
import { useI18n } from '@/shared/i18n';
import { space, useTheme } from '@/shared/theme';
import { ListGroup, ListRow, Sheet, Text } from '@/shared/ui';

export type AiReviewSheetProps = {
  visible: boolean;
  onWriting: () => void;
  onSpeaking: () => void;
  onClose: () => void;
};

export const AiReviewSheet = memo<AiReviewSheetProps>(({ visible, onWriting, onSpeaking, onClose }) => {
  const { colors } = useTheme();
  const { t } = useI18n();
  const icon = { size: 16, color: colors.textStrong, strokeWidth: 1.5 };

  return (
    <Sheet visible={visible} onClose={onClose}>
      <View style={styles.intro}>
        <Text variant="titleSheet">{t('result.aiScore')}</Text>
        <Text variant="labelRelaxed" color={colors.textSecondary}>
          {t('result.aiSheetMessage')}
        </Text>
      </View>
      <ListGroup>
        <ListRow icon={<PenLine {...icon} />} title={t('result.writingReview')} divider onPress={onWriting} />
        <ListRow icon={<Mic {...icon} />} title={t('result.speakingReview')} onPress={onSpeaking} />
      </ListGroup>
    </Sheet>
  );
});

AiReviewSheet.displayName = 'AiReviewSheet';

const styles = StyleSheet.create({
  intro: {
    gap: space[2],
    paddingHorizontal: space[1],
  },
});
