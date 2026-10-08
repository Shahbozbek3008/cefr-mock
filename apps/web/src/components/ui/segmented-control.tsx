'use client';

import { useId, useState, type ReactNode } from 'react';
import { ToggleGroup } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import { ActivePill } from '@/components/motion/active-pill';

const trackVariants = cva('flex bg-seg-track', {
  variants: {
    size: {
      md: 'h-[38px] rounded-[12px] p-[3px] text-[13px]',
      lg: 'h-11 rounded-[14px] p-1 text-sm',
    },
  },
  defaultVariants: { size: 'md' },
});

const itemVariants = cva(
  'relative isolate flex flex-1 items-center justify-center gap-2 whitespace-nowrap px-[14px] text-ink-2 transition-colors duration-(--t-base) hover:text-ink data-[state=on]:font-medium data-[state=on]:text-ink',
  {
    variants: { size: { md: 'rounded-[9px]', lg: 'rounded-sm' } },
    defaultVariants: { size: 'md' },
  },
);

export type SegmentOption = { value: string; label: ReactNode };

type SegmentedControlProps = VariantProps<typeof trackVariants> & {
  options: readonly SegmentOption[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  label: string;
  className?: string;
};

export function SegmentedControl({ options, defaultValue, value: controlled, onValueChange, label, size, className }: SegmentedControlProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? options[0]?.value);
  const value = controlled ?? uncontrolled;
  const layoutId = useId();

  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      aria-label={label}
      className={cn(trackVariants({ size }), className)}
      onValueChange={(next) => {
        if (!next) return;
        setUncontrolled(next);
        onValueChange?.(next);
      }}
    >
      {options.map((o) => (
        <ToggleGroup.Item key={o.value} value={o.value} className={itemVariants({ size })}>
          {o.value === value && <ActivePill layoutId={layoutId} className="rounded-[inherit] bg-surface shadow-[0_1px_2px_rgba(20,22,30,.08),0_2px_8px_-2px_rgba(20,22,30,.06)]" />}
          {o.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
