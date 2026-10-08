import { useTranslations } from 'next-intl';
import { initLocale, metadataTitle, type LocaleParams } from '@/lib/i18n';
import { Breadcrumb } from '@/components/ui/typography';
import { AppMain, PageHeader } from '@/components/layout/page-header';
import { Checkout } from '@/components/app/checkout';

export const generateMetadata = metadataTitle('billing.title');

function BillingView() {
  const t = useTranslations('billing');
  const ts = useTranslations('settings.nav');
  return (
    <AppMain className="gap-6">
      <PageHeader meta={<Breadcrumb items={[ts('settings'), ts('subscription')]} />} title={t('title')} />
      <Checkout />
    </AppMain>
  );
}

export default async function BillingPage({ params }: { params: LocaleParams }) {
  await initLocale(params);
  return <BillingView />;
}
