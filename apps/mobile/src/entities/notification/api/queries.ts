import { fetchNotifications as coreFetchNotifications } from '@cefr/core';
import { supabase } from '@/shared/api';

export {
  notificationKeys,
  useClearNotifications,
  useMarkAllRead,
  useMarkRead,
  useNotifications,
  useUnreadCount,
} from '@cefr/core';

export const fetchNotifications = () => coreFetchNotifications(supabase);
