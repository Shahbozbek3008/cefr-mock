'use client';

import { useTranslations } from 'next-intl';
import { Accordion } from 'radix-ui';
import { MessageCircle, Plus } from 'lucide-react';
import { SectionHeading } from '@/components/ui/typography';
import { Icon } from '@/components/ui/icon';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { Container } from './container';

const FAQ_KEYS = ['format', 'accuracy', 'free', 'offline'] as const;

export function FaqSection() {
  const t = useTranslations('landing.faq');
  return (
    <Container id="faq" className="grid scroll-mt-24 grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-start gap-x-20 gap-y-1.5 pt-16 md:gap-y-12 md:py-36">
      <div className="flex flex-col gap-6 md:sticky md:top-28">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} />
        <Reveal delay={0.1} className="flex items-center gap-3 self-start rounded-card-sm bg-surface p-3 pr-5 text-[14px] leading-normal text-ink-2 shadow-e0 max-md:hidden">
          <span className="grid size-9 place-items-center rounded-[11px] bg-blue-50 text-blue-text"><Icon as={MessageCircle} size={17} /></span>
          <span>{t.rich('help', { link: (c) => <a href="https://t.me/" className="font-medium">{c}</a> })}</span>
        </Reveal>
      </div>
      <Accordion.Root type="single" collapsible defaultValue={FAQ_KEYS[0]} asChild>
        <Stagger step={0.08} className="flex flex-col">
          {FAQ_KEYS.map((key) => (
            <Accordion.Item key={key} value={key} asChild>
              <StaggerItem className="group/item shadow-[0_1px_0_var(--divider-page)]">
                <Accordion.Header className="m-0">
                  <Accordion.Trigger className="group flex min-h-16 w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-base font-medium tracking-[-0.015em] text-ink transition-colors hover:text-green-text md:min-h-[76px] md:gap-6 md:py-5 md:text-[17px]">
                    {t(`items.${key}.q`)}
                    <span className="grid size-8 shrink-0 place-items-center rounded-full text-ink-2 shadow-inset transition-[rotate,background-color,color,box-shadow] duration-(--t-sheet) ease-spring group-hover:shadow-[inset_0_0_0_1px_var(--border-strong)] group-data-[state=open]:rotate-[135deg] group-data-[state=open]:bg-action group-data-[state=open]:text-white group-data-[state=open]:shadow-none">
                      <Icon as={Plus} size={13} strokeWidth={2} />
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <p className="m-0 pr-9 pb-[18px] text-sm leading-[1.6] text-ink-2 md:pr-14 md:pb-6 md:text-[15px] md:leading-[1.65]">{t(`items.${key}.a`)}</p>
                </Accordion.Content>
              </StaggerItem>
            </Accordion.Item>
          ))}
        </Stagger>
      </Accordion.Root>
    </Container>
  );
}
