import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@/lib/constants';
import { Logo } from '@/components/ui/logo';
import { ButtonLink } from '@/components/ui/button';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { ScrollProgress } from '@/components/motion/scroll-progress';
import { LANDING_NAV } from './nav-links';
import { NavMenu } from './nav-menu';
import { HeaderFrame } from './header-frame';
import { MobileMenu } from './mobile-menu';

export function MarketingHeader() {
  const t = useTranslations('landing.header');

  return (
    <HeaderFrame>
      <ScrollProgress />
      <div className="mx-auto flex h-14 max-w-page items-center gap-10 px-5 transition-[max-width,height,border-radius,background-color,box-shadow,padding] duration-(--t-slow) ease-out-expo max-md:bg-[rgba(250,250,250,.78)] max-md:shadow-[0_1px_0_rgba(20,22,30,.06)] max-md:backdrop-blur-[20px] max-md:backdrop-saturate-150 md:h-(--header-h) md:px-8 md:group-data-[scrolled=true]/header:h-[58px] md:group-data-[scrolled=true]/header:backdrop-blur-[20px] md:group-data-[scrolled=true]/header:backdrop-saturate-150 md:group-data-[scrolled=true]/header:max-w-[1080px] md:group-data-[scrolled=true]/header:rounded-[20px] md:group-data-[scrolled=true]/header:bg-white/72 md:group-data-[scrolled=true]/header:pr-2.5 md:group-data-[scrolled=true]/header:pl-5 md:group-data-[scrolled=true]/header:shadow-[0_0_0_1px_rgba(20,22,30,.06),0_18px_40px_-20px_rgba(20,22,30,.22)]">
        <Link href={ROUTES.home} aria-label="CEFR Mock" className="transition-opacity hover:opacity-80">
          <Logo size="lg" className="max-md:hidden" />
          <Logo size="md" className="md:hidden" />
        </Link>

        <NavMenu
          label={t('navLabel')}
          items={LANDING_NAV.map((item) => ({ href: item.href, label: t(`nav.${item.key}`) }))}
          className="flex-1 max-lg:hidden"
        />

        <div className="ml-auto flex items-center gap-1.5">
          <LocaleSwitcher variant="compact" className="mr-1 max-md:hidden" />
          <ButtonLink href={ROUTES.login} variant="ghost" size="xs" className="h-9 rounded-sm px-3 md:h-[38px] md:rounded-[11px] md:px-[14px]">
            {t('login')}
          </ButtonLink>
          <ButtonLink href={ROUTES.start} size="xs" arrow className="h-[38px] gap-2 rounded-[11px] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,.22),0_1px_2px_oklch(0.4_0.12_140/.3)] max-md:hidden">
            {t('start')}
          </ButtonLink>
          <MobileMenu />
        </div>
      </div>
    </HeaderFrame>
  );
}
