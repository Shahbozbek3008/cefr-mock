import { useTranslations } from 'use-intl';
import { AppMain, PageHeader } from '@/shared/ui/page-header';
import { ExamSection, NotificationsSection, ProfileSection, SecuritySection, SubscriptionSection } from '@/widgets/settings/ui/sections';
import { SettingsTabs } from '@/widgets/settings/ui/settings-tabs';
import { usePageTitle } from '@/shared/lib/use-page-title';

export default function SettingsPage() {
  const t = useTranslations('settings');
  usePageTitle(t('title'));

  return (
    <AppMain className="gap-6">
      <PageHeader title={t('title')} />
      <SettingsTabs
        label={t('title')}
        sections={[
          { key: 'profile', label: t('nav.profile'), content: <ProfileSection /> },
          { key: 'exam', label: t('nav.exam'), content: <ExamSection /> },
          { key: 'notifications', label: t('nav.notifications'), content: <NotificationsSection /> },
          { key: 'subscription', label: t('nav.subscription'), content: <SubscriptionSection /> },
          { key: 'security', label: t('nav.security'), content: <SecuritySection /> },
        ]}
      />
    </AppMain>
  );
}
