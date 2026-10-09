'use client';

import { useId, useState, type ReactNode } from 'react';
import { Tabs } from 'radix-ui';
import { cn } from '@/lib/cn';
import { ActivePill } from '@/components/motion/active-pill';

export type SettingsSection = { key: string; label: string; content: ReactNode };

export function SettingsTabs({ sections, label }: { sections: readonly SettingsSection[]; label: string }) {
  const [active, setActive] = useState(sections[0].key);
  const layoutId = useId();

  return (
    <Tabs.Root value={active} onValueChange={setActive} className="flex flex-col gap-6">
      <Tabs.List aria-label={label} className="flex gap-1 overflow-x-auto border-b border-divider-muted [scrollbar-width:none]">
        {sections.map((s) => {
          const selected = s.key === active;
          return (
            <Tabs.Trigger
              key={s.key}
              value={s.key}
              className={cn(
                'group relative flex h-11 shrink-0 items-center px-1 text-sm whitespace-nowrap transition-colors duration-(--t-fast) outline-none focus-visible:shadow-none',
                selected ? 'text-ink' : 'text-ink-2 hover:text-ink',
              )}
            >
              <span className="rounded-[8px] px-2.5 py-1.5 transition-colors duration-(--t-fast) group-hover:bg-[rgba(20,22,30,.045)]">{s.label}</span>
              {selected && <ActivePill layoutId={layoutId} className="inset-x-1 top-auto -bottom-px z-0 h-[2px] rounded-full bg-ink" />}
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>
      {sections.map((s) => (
        <Tabs.Content key={s.key} value={s.key} className="stagger flex max-w-[760px] flex-col gap-4 outline-none">
          {s.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
