import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TParams } from '@/shared/i18n';
import { ensureOk, requireUserId, supabase, unwrap } from '@/shared/api';
import type { Tables } from '@/shared/api';
import type { AppNotification } from '../model/types';

export const notificationKeys = {
  all: ['notifications'] as const,
};

const toNotification = (row: Tables<'notifications'>): AppNotification => ({
  id: row.id,
  kind: row.kind,
  params: row.params as TParams,
  createdAt: row.created_at,
  read: row.read,
  url: row.url ?? undefined,
});

export const fetchNotifications = async () => {
  const rows = unwrap(await supabase.from('notifications').select('*').order('created_at', { ascending: false }));
  return rows.map(toNotification);
};

const markRead = async (id: string) => {
  ensureOk(await supabase.from('notifications').update({ read: true }).eq('id', id));
};

const markAllRead = async () => {
  ensureOk(await supabase.from('notifications').update({ read: true }).eq('read', false));
};

const clearAll = async () => {
  ensureOk(
    await supabase
      .from('notifications')
      .delete()
      .eq('user_id', await requireUserId()),
  );
};

export const useNotifications = () => useQuery({ queryKey: notificationKeys.all, queryFn: fetchNotifications });

export const useUnreadCount = () => {
  const { data } = useNotifications();
  return data?.filter((item) => !item.read).length ?? 0;
};

const useNotificationMutation = <Variables>(
  request: (variables: Variables) => Promise<void>,
  apply: (items: AppNotification[], variables: Variables) => AppNotification[],
) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: request,
    onMutate: async (variables: Variables) => {
      await client.cancelQueries({ queryKey: notificationKeys.all });
      const previous = client.getQueryData<AppNotification[]>(notificationKeys.all);
      if (previous) client.setQueryData(notificationKeys.all, apply(previous, variables));
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) client.setQueryData(notificationKeys.all, context.previous);
    },
    onSettled: () => client.invalidateQueries({ queryKey: notificationKeys.all }),
  });
};

export const useMarkRead = () =>
  useNotificationMutation(markRead, (items, id: string) =>
    items.map((item) => (item.id === id ? { ...item, read: true } : item)),
  );

export const useMarkAllRead = () =>
  useNotificationMutation(markAllRead, (items) => items.map((item) => ({ ...item, read: true })));

export const useClearNotifications = () => useNotificationMutation(clearAll, () => []);
