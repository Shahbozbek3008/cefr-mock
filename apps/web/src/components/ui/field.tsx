import type { ComponentProps, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const inputShell = cva(
  'flex items-center gap-3 bg-surface px-4 shadow-inset transition-shadow duration-(--t-fast) focus-within:shadow-focus',
  {
    variants: {
      size: { lg: 'h-[52px] rounded-[14px] text-base', md: 'h-12 rounded-input px-[14px] text-[15px]' },
      readOnly: { true: 'bg-surface-muted shadow-none focus-within:shadow-none', false: '' },
    },
    defaultVariants: { size: 'lg', readOnly: false },
  },
);

type FieldProps = { label: string; htmlFor: string; hint?: ReactNode; children: ReactNode; className?: string };

export function Field({ label, htmlFor, hint, children, className }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={htmlFor} className="text-[13px] font-medium">{label}</label>
      {children}
      {hint && <span className="text-xs text-ink-2">{hint}</span>}
    </div>
  );
}

type TextInputProps = Omit<ComponentProps<'input'>, 'size'> & VariantProps<typeof inputShell> & { suffix?: ReactNode };

export function TextInput({ size, readOnly, suffix, className, ...rest }: TextInputProps) {
  return (
    <div className={cn(inputShell({ size, readOnly }), className)}>
      <input readOnly={!!readOnly} className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-ink-disabled" {...rest} />
      {suffix}
    </div>
  );
}

export function PhoneInput({ size, className, ...rest }: Omit<ComponentProps<'input'>, 'size'> & VariantProps<typeof inputShell>) {
  return (
    <div className={cn(inputShell({ size }), className)}>
      <span className="pr-3 font-mono text-ink-2 shadow-[1px_0_0_var(--divider-muted)]">+998</span>
      <input type="tel" inputMode="tel" autoComplete="tel-national" className="min-w-0 flex-1 bg-transparent font-mono caret-green outline-none placeholder:text-ink-disabled" {...rest} />
    </div>
  );
}
