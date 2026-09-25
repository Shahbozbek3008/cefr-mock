import { useCallback, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Calendar, CircleHelp, Globe, Moon, Sun, Target } from 'lucide-react-native';
import { useAttemptStore } from '@/entities/attempt';
import { useUserStore } from '@/entities/user/model';
import type { User } from '@/entities/user/model';
import { PHONE_PREFIX, formatPhone, signOutFromGoogle } from '@/features/auth/model';
import { ProfileCard } from '@/features/profile/ui/ProfileCard';
import { LanguageSheet } from '@/features/language-switch/ui/LanguageSheet';
import { ThemeSheet } from '@/features/theme-switch/ui/ThemeSheet';
import { locales, useI18n } from '@/shared/i18n';
import { hitSlop, makeStyles, size, space, useTheme, useThemePreference } from '@/shared/theme';
import { ConfirmSheet, ListGroup, ListRow, Switch, Text, useToast } from '@/shared/ui';
import { TAB_BAR_SPACE } from '@/widgets/tab-bar';

const contactOf = (user: User | null) =>
  user?.phone ? `${PHONE_PREFIX} ${formatPhone(user.phone.replace(PHONE_PREFIX, ''))}` : (user?.email ?? '');

export default function ProfileScreen() {
  const styles = useStyles();
  const { colors, scheme } = useTheme();
  const { t, locale, dayMonth } = useI18n();
  const icon = { size: 16, color: colors.textStrong, strokeWidth: 1.5 };
  const insets = useSafeAreaInsets();
  const user = useUserStore((s) => s.user);
  const examDate = useUserStore((s) => s.examDate);
  const targetLevel = useUserStore((s) => s.targetLevel);
  const reminderEnabled = useUserStore((s) => s.reminderEnabled);
  const setReminderEnabled = useUserStore((s) => s.setReminderEnabled);
  const signOut = useUserStore((s) => s.signOut);
  const resetAttempt = useAttemptStore((s) => s.reset);
  const showToast = useToast((s) => s.show);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const preference = useThemePreference((s) => s.preference);

  const onSignOut = useCallback(() => {
    setConfirmOpen(false);
    if (user?.provider === 'google') signOutFromGoogle();
    resetAttempt();
    signOut();
    router.replace('/(auth)/phone');
  }, [resetAttempt, signOut, user?.provider]);

  const soon = useCallback(() => showToast({ message: t('common.comingSoon') }), [showToast, t]);

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + size.topGap, paddingBottom: insets.bottom + TAB_BAR_SPACE + space[4] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text variant="titleLg">{t('profile.title')}</Text>
        </View>

        <ProfileCard
          name={user?.name ?? 'Aziza Karimova'}
          contact={contactOf(user)}
          monoContact={Boolean(user?.phone)}
          isPro={user?.isPro ?? false}
          onUpgrade={() => router.push('/subscription')}
        />

        <Text variant="caption" color={colors.textTertiary} style={styles.groupLabel}>
          {t('profile.exam')}
        </Text>
        <ListGroup>
          <ListRow
            icon={<Calendar {...icon} />}
            title={t('profile.examDate')}
            value={examDate ? dayMonth(examDate) : t('common.notSelected')}
            divider
            onPress={() => router.push({ pathname: '/(onboarding)/exam-date', params: { edit: '1' } })}
          />
          <ListRow
            icon={<Target {...icon} />}
            title={t('profile.targetLevel')}
            value={targetLevel ?? '—'}
            onPress={() => router.push({ pathname: '/(onboarding)/level', params: { edit: '1' } })}
          />
        </ListGroup>

        <Text variant="caption" color={colors.textTertiary} style={styles.groupLabel}>
          {t('profile.settings')}
        </Text>
        <ListGroup>
          <ListRow
            icon={scheme === 'dark' ? <Moon {...icon} /> : <Sun {...icon} />}
            title={t('profile.theme')}
            value={t(`theme.${preference}`)}
            divider
            onPress={() => setThemeOpen(true)}
          />
          <ListRow
            icon={<Bell {...icon} />}
            title={t('profile.reminders')}
            divider
            trailing={
              <Switch
                value={reminderEnabled}
                onValueChange={setReminderEnabled}
                accessibilityLabel={t('profile.reminders')}
              />
            }
          />
          <ListRow
            icon={<Globe {...icon} />}
            title={t('profile.language')}
            value={locales.find((item) => item.value === locale)?.label}
            onPress={() => setLanguageOpen(true)}
          />
        </ListGroup>

        <ListGroup>
          <ListRow icon={<CircleHelp {...icon} />} title={t('profile.help')} onPress={soon} />
        </ListGroup>

        <Pressable
          accessibilityRole="button"
          hitSlop={hitSlop}
          onPress={() => setConfirmOpen(true)}
          style={styles.signOut}
        >
          <Text variant="bodySmMedium" color={colors.error.text}>
            {t('profile.signOut')}
          </Text>
        </Pressable>
      </ScrollView>

      <ThemeSheet visible={themeOpen} onClose={() => setThemeOpen(false)} />
      <LanguageSheet visible={languageOpen} onClose={() => setLanguageOpen(false)} />
      <ConfirmSheet
        visible={confirmOpen}
        title={t('profile.signOutTitle')}
        message={t('profile.signOutMessage')}
        confirmLabel={t('common.exit')}
        cancelLabel={t('common.stay')}
        destructive
        onConfirm={onSignOut}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: size.screenPadding,
    gap: space[3.5],
  },
  header: {
    height: size.headerBar,
    justifyContent: 'center',
    paddingHorizontal: space[1],
  },
  groupLabel: {
    paddingTop: space[1.5],
    paddingHorizontal: space[1],
  },
  signOut: {
    alignSelf: 'flex-start',
    paddingTop: space[1],
    paddingHorizontal: space[1],
  },
}));
