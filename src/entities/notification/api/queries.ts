import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { delay } from '@/entities/test';
import type { AppNotification } from '../model/types';
import { buildMockNotifications } from './mock';

export const notificationKeys = {
  all: ['notifications'] as const,
};

let store: AppNotification[] | null = null;
const source = () => {
  store ??= buildMockNotifications();
  return store;
};

const update = (next: AppNotification[]) => {
  store = next;
  return delay(next, 150);
};

export const fetchNotifications = () => delay(source(), 450);

export const useNotifications = () => useQuery({ queryKey: notificationKeys.all, queryFn: fetchNotifications });

export const useUnreadCount = () => {
  const { data } = useNotifications();
  return data?.filter((item) => !item.read).length ?? 0;
};

const useNotificationMutation = (apply: (items: AppNotification[], id?: string) => AppNotification[]) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id?: string) => update(apply(source(), id)),
    onMutate: (id?: string) => {
      const current = client.getQueryData<AppNotification[]>(notificationKeys.all);
      if (current) client.setQueryData(notificationKeys.all, apply(current, id));
    },
    onSettled: () => client.invalidateQueries({ queryKey: notificationKeys.all }),
  });
};

export const useMarkRead = () =>
  useNotificationMutation((items, id) => items.map((item) => (item.id === id ? { ...item, read: true } : item)));

export const useMarkAllRead = () => useNotificationMutation((items) => items.map((item) => ({ ...item, read: true })));

export const useClearNotifications = () => useNotificationMutation(() => []);
