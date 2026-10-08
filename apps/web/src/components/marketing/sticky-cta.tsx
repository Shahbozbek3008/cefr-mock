'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { ButtonLink } from '@/components/ui/button';

const SHOW_AFTER = 560;

export function StickyCta() {
  const t = useTranslations('landing.sticky');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        'fixed inset-x-3 bottom-7 z-30 flex items-center gap-2.5 rounded-[22px] bg-white/94 p-2 shadow-[0_0_0_1px_rgba(20,22,30,.06),0_16px_32px_-14px_rgba(20,22,30,.25)] backdrop-blur-md transition-[opacity,translate] duration-(--t-sheet) ease-brand md:hidden',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <div className="flex flex-1 flex-col pl-2 leading-[1.3]">
        <span className="text-[13px] font-medium">{t('title')}</span>
        <span className="text-[11px] text-ink-2">{t('note')}</span>
      </div>
      <ButtonLink href={ROUTES.start} arrow tabIndex={visible ? 0 : -1} className="h-11 rounded-[14px] px-4">{t('cta')}</ButtonLink>
    </div>
  );
}
