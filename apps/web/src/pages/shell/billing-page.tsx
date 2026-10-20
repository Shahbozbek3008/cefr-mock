import { useTranslations } from 'use-intl';
import { Breadcrumb } from '@cefr/ui/components/typography';
import { Checkout } from '@/features/billing/ui/checkout';
import { AppMain, PageHeader } from '@/shared/ui/page-header';
import { usePageTitle } from '@/shared/lib/use-page-title';

export default function BillingPage() {
  const t = useTranslations('billing');
  const ts = useTranslations('settings.nav');
  usePageTitle(t('title'));

  return (
    <AppMain className="gap-6">
      <PageHeader meta={<Breadcrumb items={[ts('settings'), ts('subscription')]} />} title={t('title')} />
      <Checkout />
    </AppMain>
  );
}
