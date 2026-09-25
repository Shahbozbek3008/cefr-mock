import { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCheck, ChevronLeft, Trash } from 'lucide-react-native';
import {
  useClearNotifications,
  useMarkAllRead,
  useMarkRead,
  useNotifications,
  useUnreadCount,
} from '@/entities/notification';
import type { AppNotification } from '@/entities/notification';
import { useUserStore } from '@/entities/user/model';
import { groupNotifications } from '@/features/notifications/model/group';
import { NotificationRow } from '@/features/notifications/ui/NotificationRow';
import { NotificationsEmpty } from '@/features/notifications/ui/NotificationsEmpty';
import { NotificationsSkeleton } from '@/features/notifications/ui/NotificationsSkeleton';
import { useI18n } from '@/shared/i18n';
import { useRefresh } from '@/shared/lib';
import { makeStyles, size, space, useTheme } from '@/shared/theme';
import { Card, ConfirmSheet, IconButton, RefreshControl, Screen, StateView, Text, TopBar } from '@/shared/ui';

export default function NotificationsScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const notifications = useNotifications();
  const unread = useUnreadCount();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();
  const clear = useClearNotifications();
  const reminderEnabled = useUserStore((s) => s.reminderEnabled);
  const setReminderEnabled = useUserStore((s) => s.setReminderEnabled);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const refresh = useRefresh(notifications.refetch);

  const items = notifications.data;
  const sections = useMemo(() => groupNotifications(items ?? []), [items]);
  const hasItems = sections.length > 0;

  const open = useCallback(
    (item: AppNotification) => {
      if (!item.read) markRead.mutate(item.id);
      if (item.url) router.push(item.url as Href);
    },
    [markRead],
  );

  const onClear = useCallback(() => {
    setConfirmOpen(false);
    clear.mutate(undefined);
  }, [clear]);

  const content = notifications.isPending ? (
    <NotificationsSkeleton />
  ) : notifications.isError ? (
    <StateView
      tone="error"
      title={t('common.error')}
      message={t('notifications.loadFailed')}
      actionLabel={t('common.retry')}
      onAction={() => notifications.refetch()}
    />
  ) : hasItems ? (
    sections.map((section) => (
      <View key={section.group} style={styles.group}>
        <Text variant="caption" color={colors.textTertiary} style={styles.groupLabel}>
          {t(`notifications.${section.group}`)}
        </Text>
        <Card style={styles.card}>
          {section.items.map((item, index) => (
            <NotificationRow key={item.id} item={item} divider={index < section.items.length - 1} onPress={open} />
          ))}
        </Card>
      </View>
    ))
  ) : (
    <NotificationsEmpty onEnable={reminderEnabled ? undefined : () => setReminderEnabled(true)} />
  );

  return (
    <Screen>
      <TopBar
        centered
        left={
          <IconButton accessibilityLabel={t('common.back')} onPress={router.back}>
            <ChevronLeft size={17} color={colors.textStrong} strokeWidth={1.6} />
          </IconButton>
        }
        center={
          <>
            <Text variant="bodySmMedium">{t('notifications.title')}</Text>
            <Text variant="caption" color={colors.textSecondary}>
              {unread > 0 ? t('notifications.unread', { count: unread }) : ' '}
            </Text>
          </>
        }
        right={
          hasItems ? (
            unread > 0 ? (
              <IconButton
                accessibilityLabel={t('notifications.markAllRead')}
                onPress={() => markAllRead.mutate(undefined)}
              >
                <CheckCheck size={17} color={colors.textStrong} strokeWidth={1.6} />
              </IconButton>
            ) : (
              <IconButton accessibilityLabel={t('notifications.clear')} onPress={() => setConfirmOpen(true)}>
                <Trash size={16} color={colors.textStrong} strokeWidth={1.6} />
              </IconButton>
            )
          ) : null
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space[6] }]}
        refreshControl={<RefreshControl refreshing={refresh.refreshing} onRefresh={refresh.onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {content}
      </ScrollView>

      <ConfirmSheet
        visible={confirmOpen}
        title={t('notifications.clearTitle')}
        message={t('notifications.clearMessage')}
        confirmLabel={t('notifications.clear')}
        cancelLabel={t('common.cancel')}
        destructive
        onConfirm={onClear}
        onClose={() => setConfirmOpen(false)}
      />
    </Screen>
  );
}

const useStyles = makeStyles(() => ({
  scroll: {
    marginHorizontal: -size.screenPadding,
  },
  content: {
    flexGrow: 1,
    paddingTop: space[3.5],
    paddingHorizontal: size.screenPadding,
    gap: space[5],
  },
  group: {
    gap: space[2],
  },
  groupLabel: {
    paddingHorizontal: space[1],
  },
  card: {
    overflow: 'hidden',
  },
}));
