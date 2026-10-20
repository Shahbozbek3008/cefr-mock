import { useTranslations } from 'use-intl';
import { CatalogView } from '@/features/catalog/ui/catalog-view';
import { AppMain } from '@/shared/ui/page-header';
import { usePageTitle } from '@/shared/lib/use-page-title';

export default function CatalogPage() {
  const t = useTranslations('catalog');
  usePageTitle(t('title'));

  return (
    <AppMain className="gap-5">
      <CatalogView />
    </AppMain>
  );
}
