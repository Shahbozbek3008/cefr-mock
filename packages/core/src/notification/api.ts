import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCefrClient, type CefrClient } from '../api/client';
import type { Tables } from '../api/database';
import { ensureOk, requireUserId, unwrap } from '../api/errors';

export type NotificationKind = 'result' | 'aiReview' | 'reminder' | 'newTest' | 'exam';

export type NotificationParams = Record<string, string | number>;

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  params: NotificationParams;
  createdAt: string;
  read: boolean;
  url?: string;
};

export const notificationKeys = {
  all: ['notifications'] as const,
};

const toNotification = (row: Tables<'notifications'>): AppNotification => ({
  id: row.id,
  kind: row.kind,
  params: row.params as NotificationParams,
  createdAt: row.created_at,
  read: row.read,
  url: row.url ?? undefined,
});

export const fetchNotifications = async (client: CefrClient) => {
  const rows = unwrap(await client.from('notifications').select('*').order('created_at', { ascending: false }));
  return rows.map(toNotification);
};

const markRead = async (client: CefrClient, id: string) => {
  ensureOk(await client.from('notifications').update({ read: true }).eq('id', id));
};

const markAllRead = async (client: CefrClient) => {
  ensureOk(await client.from('notifications').update({ read: true }).eq('read', false));
};

const clearAll = async (client: CefrClient) => {
  ensureOk(
    await client
      .from('notifications')
      .delete()
      .eq('user_id', await requireUserId(client)),
  );
};

export const useNotifications = () => {
  const client = useCefrClient();
  return useQuery({ queryKey: notificationKeys.all, queryFn: () => fetchNotifications(client) });
};

export const useUnreadCount = () => {
  const { data } = useNotifications();
  return data?.filter((item) => !item.read).length ?? 0;
};

const useNotificationMutation = <Variables>(
  request: (client: CefrClient, variables: Variables) => Promise<void>,
  apply: (items: AppNotification[], variables: Variables) => AppNotification[],
) => {
  const client = useCefrClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: Variables) => request(client, variables),
    onMutate: async (variables: Variables) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });
      const previous = queryClient.getQueryData<AppNotification[]>(notificationKeys.all);
      if (previous) queryClient.setQueryData(notificationKeys.all, apply(previous, variables));
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(notificationKeys.all, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
};

export const useMarkRead = () =>
  useNotificationMutation(markRead, (items, id: string) => items.map((item) => (item.id === id ? { ...item, read: true } : item)));

export const useMarkAllRead = () =>
  useNotificationMutation(
    (client) => markAllRead(client),
    (items) => items.map((item) => ({ ...item, read: true })),
  );

export const useClearNotifications = () =>
  useNotificationMutation(
    (client) => clearAll(client),
    () => [],
  );
