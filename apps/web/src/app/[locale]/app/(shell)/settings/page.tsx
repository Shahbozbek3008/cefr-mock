import { useTranslations } from 'next-intl';
import { initLocale, metadataTitle, type LocaleParams } from '@/lib/i18n';
import { AppMain, PageHeader } from '@/components/layout/page-header';
import { SettingsTabs } from '@/components/settings/settings-tabs';
import { ExamSection, NotificationsSection, ProfileSection, SecuritySection, SubscriptionSection } from '@/components/settings/sections';

export const generateMetadata = metadataTitle('settings.title');

function SettingsView() {
  const t = useTranslations('settings');
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

export default async function SettingsPage({ params }: { params: LocaleParams }) {
  await initLocale(params);
  return <SettingsView />;
}
