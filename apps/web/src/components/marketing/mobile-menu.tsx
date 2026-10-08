'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog } from 'radix-ui';
import { ChevronRight, Equal, Smartphone, X } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { Icon } from '@/components/ui/icon';
import { Logo } from '@/components/ui/logo';
import { ButtonLink } from '@/components/ui/button';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { LANDING_NAV, SOCIAL_LINKS } from './nav-links';

const MENU_ITEMS = LANDING_NAV.filter((i) => i.key !== 'app');

const squareBtn = 'grid size-10 place-items-center rounded-[12px] bg-surface text-ink shadow-inset transition-[scale,box-shadow] duration-(--t-base) active:scale-95';

export function MobileMenu() {
  const t = useTranslations('landing');
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={`${squareBtn} lg:hidden`} aria-label={t('header.menuOpen')}>
        <Icon as={Equal} strokeWidth={1.75} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content className="fixed inset-0 z-50 flex flex-col bg-bg/95 backdrop-blur-xl data-[state=closed]:animate-sheet-out data-[state=open]:animate-sheet-in" aria-describedby={undefined}>
          <Dialog.Title className="sr-only">{t('header.navLabel')}</Dialog.Title>
          <div className="flex h-14 shrink-0 items-center justify-between px-5">
            <Logo size="md" />
            <Dialog.Close className={squareBtn} aria-label={t('header.menuClose')}>
              <Icon as={X} strokeWidth={1.75} className="animate-pop" />
            </Dialog.Close>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-6 pb-10">
            <nav className="stagger flex flex-col">
              {MENU_ITEMS.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={close}
                  className="group flex h-[68px] items-center justify-between text-[26px] font-medium tracking-[-0.035em] text-ink shadow-[0_1px_0_var(--divider-muted)] hover:text-ink"
                >
                  {t(`header.navMenu.${item.key}`)}
                  <Icon as={ChevronRight} size={20} className="text-ink-4 transition-transform duration-(--t-base) group-hover:translate-x-1 group-active:translate-x-1" />
                </a>
              ))}
            </nav>
            <div className="flex animate-fade-up items-center gap-[18px] pt-7 text-sm [animation-delay:320ms]">
              {SOCIAL_LINKS.map((s) => (
                <a key={s.key} href={s.href} className="text-ink-2">{t(`footer.${s.key}`)}</a>
              ))}
              <a href="#faq" onClick={close} className="text-ink-2">{t('footer.help')}</a>
              <LocaleSwitcher variant="compact" side="top" className="ml-auto" />
            </div>

            <div className="stagger mt-auto flex flex-col gap-2 pt-8">
              <a href="#download" onClick={close} className="mb-2 flex items-center gap-3 rounded-card-sm bg-surface p-[14px] text-ink shadow-e0 hover:text-ink">
                <span className="grid size-10 place-items-center rounded-[12px] bg-green-100 text-green-text"><Icon as={Smartphone} /></span>
                <span className="flex flex-1 flex-col leading-[1.35]">
                  <span className="text-sm font-medium">{t('menu.download')}</span>
                  <span className="text-xs text-ink-2">{t('menu.platforms')}</span>
                </span>
                <Icon as={ChevronRight} size={16} strokeWidth={1.75} className="text-ink-3" />
              </a>
              <ButtonLink href={ROUTES.login} variant="secondary" block>{t('header.login')}</ButtonLink>
              <ButtonLink href={ROUTES.start} arrow block>{t('header.start')}</ButtonLink>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
