import { useCallback, useState } from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Headset, LifeBuoy, Phone } from 'lucide-react-native';
import { PHONE_PREFIX, formatPhone } from '@/features/auth/model';
import { ContactRow } from '@/features/help/ui/ContactRow';
import { faqTopics } from '@/features/help/model/faq';
import type { FaqTopic } from '@/features/help/model/faq';
import { FaqGrid } from '@/features/help/ui/FaqGrid';
import { FaqSheet } from '@/features/help/ui/FaqSheet';
import { useI18n } from '@/shared/i18n';
import { makeStyles, size, space, useTheme } from '@/shared/theme';
import { Card, IconButton, IconTile, ListGroup, Screen, Text, TopBar, useToast } from '@/shared/ui';

const SUPPORT_DIGITS = '773713008';
const SUPPORT_PHONE = `${PHONE_PREFIX}${SUPPORT_DIGITS}`;

export default function HelpScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const showToast = useToast((s) => s.show);
  const [topic, setTopic] = useState<FaqTopic | null>(null);
  const [topicOpen, setTopicOpen] = useState(false);
  const icon = { size: 16, color: colors.textStrong, strokeWidth: 1.5 };

  const call = useCallback(() => {
    Linking.openURL(`tel:${SUPPORT_PHONE}`).catch(() =>
      showToast({ message: t('help.callFailed', { phone: SUPPORT_PHONE }), tone: 'error' }),
    );
  }, [showToast, t]);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)/profile'));

  const openTopic = (next: FaqTopic) => {
    setTopic(next);
    setTopicOpen(true);
  };

  return (
    <Screen>
      <TopBar
        centered
        left={
          <IconButton accessibilityLabel={t('common.back')} onPress={goBack}>
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
            <ContactRow
              icon={<Headset {...icon} />}
              value={`${PHONE_PREFIX} ${formatPhone(SUPPORT_DIGITS)}`}
              label={t('help.callHint')}
              accessibilityLabel={t('help.call')}
              action={<Phone size={16} color={colors.onAction} strokeWidth={1.8} />}
              onPress={call}
            />
          </ListGroup>
        </View>

        <View style={styles.section}>
          <Text variant="caption" color={colors.textTertiary} style={styles.sectionLabel}>
            {t('help.faqTitle')}
          </Text>
          <FaqGrid topics={faqTopics} onOpen={openTopic} />
        </View>

        <Text variant="caption" color={colors.textTertiary} style={styles.version}>
          {t('help.version', { version: Constants.expoConfig?.version ?? '—' })}
        </Text>
      </ScrollView>

      <FaqSheet visible={topicOpen} topic={topic} onClose={() => setTopicOpen(false)} onCall={call} />
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
