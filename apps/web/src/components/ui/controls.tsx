'use client';

import type { ReactNode } from 'react';
import { Checkbox as RCheckbox, RadioGroup, Switch as RSwitch } from 'radix-ui';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Icon } from './icon';

export function Switch({ defaultChecked, label }: { defaultChecked?: boolean; label: string }) {
  return (
    <RSwitch.Root
      defaultChecked={defaultChecked}
      aria-label={label}
      className="group flex h-[26px] w-11 shrink-0 rounded-[13px] bg-line p-[3px] transition-colors duration-(--t-base) data-[state=checked]:bg-green"
    >
      <RSwitch.Thumb className="size-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,.2)] transition-[translate,width] duration-(--t-sheet) ease-spring group-active:w-6 data-[state=checked]:translate-x-[18px] group-active:data-[state=checked]:translate-x-[14px]" />
    </RSwitch.Root>
  );
}

export function Checkbox({ defaultChecked, id, children }: { defaultChecked?: boolean; id: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 text-[13px] leading-normal text-ink-2">
      <RCheckbox.Root
        id={id}
        defaultChecked={defaultChecked}
        className="grid size-5 shrink-0 place-items-center rounded-md bg-surface text-white shadow-[inset_0_0_0_1.5px_var(--border-strong)] transition-[background-color,box-shadow] duration-(--t-base) data-[state=checked]:bg-green data-[state=checked]:shadow-none"
      >
        <RCheckbox.Indicator className="animate-pop">
          <Icon as={Check} size={12} strokeWidth={2.6} />
        </RCheckbox.Indicator>
      </RCheckbox.Root>
      <label htmlFor={id}>{children}</label>
    </div>
  );
}

export function RadioDot({ size = 22, className }: { size?: 18 | 22; className?: string }) {
  return (
    <span
      className={cn(
        'shrink-0 rounded-full shadow-[inset_0_0_0_1.5px_var(--text-4)] transition-[border-width,box-shadow] duration-(--t-sheet) ease-spring group-data-[state=checked]:border-green group-data-[state=checked]:bg-white group-data-[state=checked]:shadow-none',
        size === 22 ? 'size-[22px] group-data-[state=checked]:border-[7px]' : 'size-[18px] group-data-[state=checked]:border-[5.5px]',
        className,
      )}
      aria-hidden
    />
  );
}

type RadioCardGroupProps<T extends { value: string }> = {
  items: readonly T[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  label: string;
  className?: string;
  itemClassName?: string;
  renderItem: (item: T) => ReactNode;
};

export function RadioCardGroup<T extends { value: string }>({ items, defaultValue, value, onValueChange, label, className, itemClassName, renderItem }: RadioCardGroupProps<T>) {
  return (
    <RadioGroup.Root defaultValue={defaultValue} value={value} onValueChange={onValueChange} aria-label={label} className={className}>
      {items.map((item) => (
        <RadioGroup.Item
          key={item.value}
          value={item.value}
          className={cn('group w-full text-left transition-[background-color,box-shadow,translate] duration-(--t-base) ease-out-expo hover:-translate-y-0.5', itemClassName)}
        >
          {renderItem(item)}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
