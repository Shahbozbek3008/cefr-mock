import { useCallback } from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, LifeBuoy, Phone } from 'lucide-react-native';
import { PHONE_PREFIX, formatPhone } from '@/features/auth/model';
import { FaqItem } from '@/features/help/ui/FaqItem';
import { useI18n } from '@/shared/i18n';
import type { TKey } from '@/shared/i18n';
import { makeStyles, size, space, useTheme } from '@/shared/theme';
import { Card, IconButton, IconTile, ListGroup, ListRow, Screen, Text, TopBar, useToast } from '@/shared/ui';

const SUPPORT_DIGITS = '773713008';
const SUPPORT_PHONE = `${PHONE_PREFIX}${SUPPORT_DIGITS}`;

const faq: { question: TKey; answer: TKey }[] = [
  { question: 'help.faq.modesQ', answer: 'help.faq.modesA' },
  { question: 'help.faq.scoreQ', answer: 'help.faq.scoreA' },
  { question: 'help.faq.aiQ', answer: 'help.faq.aiA' },
  { question: 'help.faq.micQ', answer: 'help.faq.micA' },
  { question: 'help.faq.offlineQ', answer: 'help.faq.offlineA' },
  { question: 'help.faq.retakeQ', answer: 'help.faq.retakeA' },
];

export default function HelpScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const showToast = useToast((s) => s.show);
  const icon = { size: 16, color: colors.textStrong, strokeWidth: 1.5 };

  const call = useCallback(() => {
    Linking.openURL(`tel:${SUPPORT_PHONE}`).catch(() =>
      showToast({ message: t('help.callFailed', { phone: SUPPORT_PHONE }), tone: 'error' }),
    );
  }, [showToast, t]);

  return (
    <Screen>
      <TopBar
        centered
        left={
          <IconButton accessibilityLabel={t('common.back')} onPress={router.back}>
            <ChevronLeft size={17} color={colors.textStrong} strokeWidth={1.6} />
          </IconButton>
        }
        center={<Text variant="bodySmMedium">{t('help.title')}</Text>}
        right={null}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space[6] }]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.intro}>
          <IconTile size={44} background={colors.selectedBg}>
            <LifeBuoy size={20} color={colors.selectedText} strokeWidth={1.6} />
          </IconTile>
          <View style={styles.introText}>
            <Text variant="heading">{t('help.introTitle')}</Text>
            <Text variant="bodySm" color={colors.textSecondary}>
              {t('help.introText')}
            </Text>
          </View>
        </Card>

        <View style={styles.section}>
          <Text variant="caption" color={colors.textTertiary} style={styles.sectionLabel}>
            {t('help.contact')}
          </Text>
          <ListGroup>
            <ListRow
              icon={<Phone {...icon} />}
              title={t('help.call')}
              value={`${PHONE_PREFIX} ${formatPhone(SUPPORT_DIGITS)}`}
              onPress={call}
            />
          </ListGroup>
        </View>

        <View style={styles.section}>
          <Text variant="caption" color={colors.textTertiary} style={styles.sectionLabel}>
            {t('help.faqTitle')}
          </Text>
          <ListGroup>
            {faq.map((item, index) => (
              <FaqItem
                key={item.question}
                question={t(item.question)}
                answer={t(item.answer)}
                divider={index < faq.length - 1}
              />
            ))}
          </ListGroup>
        </View>

        <Text variant="caption" color={colors.textTertiary} style={styles.version}>
          {t('help.version', { version: Constants.expoConfig?.version ?? '—' })}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const useStyles = makeStyles(() => ({
  content: {
    paddingTop: space[4],
    gap: space[5],
  },
  intro: {
    padding: space[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3.5],
  },
  introText: {
    flex: 1,
    gap: space[1],
  },
  section: {
    gap: space[2],
  },
  sectionLabel: {
    paddingHorizontal: space[1],
  },
  version: {
    textAlign: 'center',
    paddingHorizontal: size.screenPadding,
  },
}));
