import type { ReactNode } from 'react';
import { initLocale, type LocaleParams } from '@/lib/i18n';
import { MarketingHeader } from '@/components/marketing/header';
import { MarketingFooter } from '@/components/marketing/footer';
import { StickyCta } from '@/components/marketing/sticky-cta';

export default async function MarketingLayout({ children, params }: { children: ReactNode; params: LocaleParams }) {
  await initLocale(params);
  return (
    <div className="min-h-dvh overflow-x-clip bg-bg max-md:pb-[120px]">
      <MarketingHeader />
      <main>{children}</main>
      <MarketingFooter />
      <StickyCta />
    </div>
  );
}
