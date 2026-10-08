import type { TParams } from '@/shared/i18n';

export type NotificationKind = 'result' | 'aiReview' | 'reminder' | 'newTest' | 'exam';

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  params: TParams;
  createdAt: string;
  read: boolean;
  url?: string;
};
