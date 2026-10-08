import { initLocale, metadataTitle, type LocaleParams } from '@/lib/i18n';
import { AppMain } from '@/components/layout/page-header';
import { CatalogView } from '@/components/exam/catalog-view';

export const generateMetadata = metadataTitle('catalog.title');

export default async function CatalogPage({ params }: { params: LocaleParams }) {
  await initLocale(params);
  return (
    <AppMain className="gap-5">
      <CatalogView />
    </AppMain>
  );
}
