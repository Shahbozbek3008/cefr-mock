import { memo } from 'react';
import { View } from 'react-native';
import { Phone } from 'lucide-react-native';
import { useI18n } from '@/shared/i18n';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Button, IconTile, Sheet, Text } from '@/shared/ui';
import type { FaqTopic } from '../model/faq';

export type FaqSheetProps = {
  visible: boolean;
  topic: FaqTopic | null;
  onClose: () => void;
  onCall: () => void;
};

export const FaqSheet = memo<FaqSheetProps>(({ visible, topic, onClose, onCall }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const Icon = topic?.icon;

  return (
    <Sheet visible={visible} onClose={onClose}>
      {topic && Icon ? (
        <>
          <View style={styles.header}>
            <IconTile size={44} background={colors.selectedBg}>
              <Icon size={20} color={colors.selectedText} strokeWidth={1.7} />
            </IconTile>
            <Text variant="titleSheet">{t(topic.question)}</Text>
          </View>

          <Text variant="labelRelaxed" color={colors.textStrong} style={styles.answer}>
            {t(topic.answer)}
          </Text>

          <View style={styles.footer}>
            <Text variant="callout" color={colors.textSecondary}>
              {t('help.stillNeedHelp')}
            </Text>
            <Button
              label={t('help.callUs')}
              variant="soft"
              size="M"
              align="center"
              icon={<Phone size={16} color={colors.selectedText} strokeWidth={1.8} />}
              onPress={onCall}
            />
          </View>
        </>
      ) : null}
    </Sheet>
  );
});

FaqSheet.displayName = 'FaqSheet';

const useStyles = makeStyles(({ colors }) => ({
  header: {
    gap: space[3.5],
    paddingTop: space[1],
  },
  answer: {
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    padding: space[4],
  },
  footer: {
    gap: space[2.5],
    paddingTop: space[1],
  },
}));
