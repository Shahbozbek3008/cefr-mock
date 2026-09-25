import { useCallback, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Calendar, CircleHelp, Globe, Moon, Sun, Target } from 'lucide-react-native';
import { useAttemptStore } from '@/entities/attempt';
import { useUserStore } from '@/entities/user/model';
import { PHONE_PREFIX, formatPhone } from '@/features/auth/model';
import { ProfileCard } from '@/features/profile/ui/ProfileCard';
import { themeLabel } from '@/features/theme-switch/model/options';
import { ThemeSheet } from '@/features/theme-switch/ui/ThemeSheet';
import { formatDayMonth } from '@/shared/lib';
import { hitSlop, makeStyles, size, space, useTheme, useThemePreference } from '@/shared/theme';
import { ConfirmSheet, ListGroup, ListRow, Switch, Text, useToast } from '@/shared/ui';
import { TAB_BAR_SPACE } from '@/widgets/tab-bar';

const displayPhone = (phone: string) => `${PHONE_PREFIX} ${formatPhone(phone.replace(PHONE_PREFIX, ''))}`;

export default function ProfileScreen() {
  const styles = useStyles();
  const { colors, scheme } = useTheme();
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
  const preference = useThemePreference((s) => s.preference);

  const onSignOut = useCallback(() => {
    setConfirmOpen(false);
    resetAttempt();
    signOut();
    router.replace('/(auth)/phone');
  }, [resetAttempt, signOut]);

  const soon = useCallback(() => showToast({ message: "Bu sozlama keyingi versiyada qo'shiladi" }), [showToast]);

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
          <Text variant="titleLg">Profil</Text>
        </View>

        <ProfileCard
          name={user?.name ?? 'Aziza Karimova'}
          phone={displayPhone(user?.phone ?? '')}
          isPro={user?.isPro ?? false}
          onUpgrade={() => router.push('/subscription')}
        />

        <Text variant="caption" color={colors.textTertiary} style={styles.groupLabel}>
          Imtihon
        </Text>
        <ListGroup>
          <ListRow
            icon={<Calendar {...icon} />}
            title="Imtihon sanasi"
            value={examDate ? formatDayMonth(examDate) : 'Tanlanmagan'}
            divider
            onPress={() => router.push({ pathname: '/(onboarding)/exam-date', params: { edit: '1' } })}
          />
          <ListRow
            icon={<Target {...icon} />}
            title="Maqsad daraja"
            value={targetLevel ?? '—'}
            onPress={() => router.push({ pathname: '/(onboarding)/level', params: { edit: '1' } })}
          />
        </ListGroup>

        <Text variant="caption" color={colors.textTertiary} style={styles.groupLabel}>
          Sozlamalar
        </Text>
        <ListGroup>
          <ListRow
            icon={scheme === 'dark' ? <Moon {...icon} /> : <Sun {...icon} />}
            title="Tema"
            value={themeLabel(preference)}
            divider
            onPress={() => setThemeOpen(true)}
          />
          <ListRow
            icon={<Bell {...icon} />}
            title="Eslatmalar"
            divider
            trailing={
              <Switch value={reminderEnabled} onValueChange={setReminderEnabled} accessibilityLabel="Eslatmalar" />
            }
          />
          <ListRow icon={<Globe {...icon} />} title="Interfeys tili" value="O'zbekcha" onPress={soon} />
        </ListGroup>

        <ListGroup>
          <ListRow icon={<CircleHelp {...icon} />} title="Yordam va aloqa" onPress={soon} />
        </ListGroup>

        <Pressable
          accessibilityRole="button"
          hitSlop={hitSlop}
          onPress={() => setConfirmOpen(true)}
          style={styles.signOut}
        >
          <Text variant="bodySmMedium" color={colors.error.text}>
            Chiqish
          </Text>
        </Pressable>
      </ScrollView>

      <ThemeSheet visible={themeOpen} onClose={() => setThemeOpen(false)} />
      <ConfirmSheet
        visible={confirmOpen}
        title="Hisobdan chiqasizmi?"
        message="Qurilmadagi tugallanmagan test javoblari o'chiriladi."
        confirmLabel="Chiqish"
        cancelLabel="Qolish"
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
