'use client';

import { useId, useState, type ReactNode } from 'react';
import { Tabs } from 'radix-ui';
import { cn } from '@/lib/cn';
import { ActivePill } from '@/components/motion/active-pill';

export type SettingsSection = { key: string; label: string; icon: ReactNode; content: ReactNode };

export function SettingsTabs({ sections, label }: { sections: readonly SettingsSection[]; label: string }) {
  const [active, setActive] = useState(sections[0].key);
  const layoutId = useId();

  return (
    <Tabs.Root value={active} onValueChange={setActive} orientation="vertical" className="grid items-start gap-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10">
      <Tabs.List aria-label={label} className="flex gap-0.5 overflow-x-auto lg:sticky lg:top-20 lg:flex-col">
        {sections.map((s) => (
          <Tabs.Trigger
            key={s.key}
            value={s.key}
            className={cn(
              'relative isolate flex h-9 shrink-0 items-center gap-2.5 rounded-[10px] px-3 text-[13px] whitespace-nowrap transition-colors duration-(--t-fast) outline-none focus-visible:shadow-focus',
              s.key === active ? 'font-medium text-ink [&_svg]:text-ink' : 'text-ink-2 hover:bg-[rgba(20,22,30,.045)] hover:text-ink [&_svg]:text-ink-3',
            )}
          >
            {s.key === active && <ActivePill layoutId={layoutId} className="rounded-[10px] bg-surface shadow-[0_0_0_1px_rgba(20,22,30,.07),0_1px_3px_rgba(20,22,30,.06)]" />}
            {s.icon}
            {s.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {sections.map((s) => (
        <Tabs.Content key={s.key} value={s.key} className="stagger flex max-w-[760px] flex-col gap-4 outline-none">
          {s.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
