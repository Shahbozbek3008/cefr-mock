import { useTranslations } from 'next-intl';
import { Bell, CreditCard, GraduationCap, ShieldCheck, UserRound } from 'lucide-react';
import { initLocale, metadataTitle, type LocaleParams } from '@/lib/i18n';
import { Icon } from '@/components/ui/icon';
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
          { key: 'profile', label: t('nav.profile'), icon: <Icon as={UserRound} size={15} strokeWidth={1.7} />, content: <ProfileSection /> },
          { key: 'exam', label: t('nav.exam'), icon: <Icon as={GraduationCap} size={15} strokeWidth={1.7} />, content: <ExamSection /> },
          { key: 'notifications', label: t('nav.notifications'), icon: <Icon as={Bell} size={15} strokeWidth={1.7} />, content: <NotificationsSection /> },
          { key: 'subscription', label: t('nav.subscription'), icon: <Icon as={CreditCard} size={15} strokeWidth={1.7} />, content: <SubscriptionSection /> },
          { key: 'security', label: t('nav.security'), icon: <Icon as={ShieldCheck} size={15} strokeWidth={1.7} />, content: <SecuritySection /> },
        ]}
      />
    </AppMain>
  );
}

export default async function SettingsPage({ params }: { params: LocaleParams }) {
  await initLocale(params);
  return <SettingsView />;
}
