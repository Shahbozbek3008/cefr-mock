import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { LifeBuoy } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@/lib/constants';
import { Logo } from '@/components/ui/logo';
import { Icon } from '@/components/ui/icon';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { LANDING_NAV, LEGAL_LINKS, SOCIAL_LINKS } from './nav-links';

const linkClass = 'group/link relative w-fit text-ink-2 hover:text-ink';
const iconClass = 'shrink-0 text-ink-3 transition-colors duration-(--t-fast) group-hover/link:text-ink';
const underline = 'absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-(--t-sheet) ease-out-expo group-hover/link:origin-left group-hover/link:scale-x-100';

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[13px] font-medium text-ink">{title}</span>
      {children}
    </div>
  );
}

export function MarketingFooter() {
  const t = useTranslations('landing');
  const tf = useTranslations('landing.footer');

  return (
    <footer className="shadow-[0_-1px_0_var(--divider-page)]">
      <div className="mx-auto flex max-w-page flex-col gap-8 px-5 pt-10 pb-6 text-[13px] md:px-8 md:pt-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
            <Link href={ROUTES.home} aria-label="CEFR Mock" className="w-fit"><Logo /></Link>
            <p className="m-0 max-w-[280px] leading-[1.55] text-ink-2">{tf('tagline')}</p>
            <span className="flex w-fit items-center gap-2 rounded-pill bg-surface px-2.5 py-1 text-[11.5px] text-ink-2 shadow-e0">
              <span className="relative grid size-1.5 place-items-center">
                <span className="absolute size-1.5 animate-ping-soft rounded-full bg-green" />
                <span className="size-1.5 rounded-full bg-green" />
              </span>
              {tf('status')}
            </span>
          </div>
          <Column title={tf('product')}>
            {LANDING_NAV.map((l) => (
              <a key={l.key} href={l.href} className={linkClass}>{t(`header.nav.${l.key}`)}<span className={underline} /></a>
            ))}
          </Column>
          <Column title={tf('resources')}>
            {SOCIAL_LINKS.map((l) => (
              <a key={l.key} href={l.href} target="_blank" rel="noreferrer" className={`${linkClass} flex items-center gap-2`}>
                <l.icon size={14} className={iconClass} />
                {tf(l.key)}
              </a>
            ))}
            <a href="#faq" className={`${linkClass} flex items-center gap-2`}>
              <Icon as={LifeBuoy} size={14} strokeWidth={1.8} className={iconClass} />
              {tf('help')}
            </a>
          </Column>
          <Column title={tf('legal')}>
            {LEGAL_LINKS.map((l) => (
              <a key={l.key} href={l.href} className={linkClass}>{tf(l.key)}<span className={underline} /></a>
            ))}
          </Column>
        </div>
        <div className="flex flex-col-reverse gap-3 pt-5 text-xs text-ink-3 shadow-[0_-1px_0_var(--divider-page)] md:flex-row md:items-center md:justify-between">
          <span>© 2026 CEFR Mock. {tf('rights')}</span>
          <LocaleSwitcher side="top" />
        </div>
      </div>
    </footer>
  );
}
