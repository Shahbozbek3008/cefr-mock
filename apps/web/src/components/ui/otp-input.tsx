'use client';

import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react';
import { cva } from 'class-variance-authority';

const cell = cva('w-full text-center font-mono outline-none transition-[box-shadow,background-color,scale] duration-(--t-base) ease-out-expo focus:scale-[1.04]', {
  variants: {
    state: {
      empty: 'bg-surface shadow-inset focus:shadow-focus',
      filled: 'bg-surface shadow-[inset_0_0_0_1px_var(--border-strong)] focus:shadow-focus',
      success: 'animate-pop bg-success-50 text-success shadow-[inset_0_0_0_1.5px_var(--success-text)]',
      error: 'bg-error-50 text-error-text shadow-[inset_0_0_0_1.5px_var(--error-500)]',
    },
    size: { lg: 'h-[60px] rounded-[14px] text-2xl', md: 'h-14 rounded-[14px] text-[22px]' },
  },
});

type OtpInputProps = {
  length?: number;
  defaultValue?: string;
  success?: boolean;
  size?: 'lg' | 'md';
  label: string;
  autoFocusIndex?: number;
  disabled?: boolean;
  error?: boolean;
  onChange?: (code: string) => void;
};

export function OtpInput({ length = 6, defaultValue = '', success = false, size = 'lg', label, autoFocusIndex, disabled = false, error = false, onChange }: OtpInputProps) {
  const [digits, setDigits] = useState(() => Array.from({ length }, (_, i) => defaultValue[i] ?? ''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const commit = (next: string[]) => {
    setDigits(next);
    onChange?.(next.join(''));
  };

  const update = (index: number, value: string) => {
    commit(digits.map((d, i) => (i === index ? value : d)));
    if (value && index < length - 1) refs.current[index + 1]?.focus();
  };

  const onKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) refs.current[index - 1]?.focus();
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    commit(Array.from({ length }, (_, i) => pasted[i] ?? ''));
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div role="group" aria-label={label} className="grid grid-cols-6 gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={d}
          readOnly={success || disabled}
          autoFocus={i === autoFocusIndex}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          aria-label={`${label} ${i + 1}`}
          onChange={(e) => update(i, e.target.value.replace(/\D/g, '').slice(-1))}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={onPaste}
          className={cell({ size, state: success ? 'success' : error ? 'error' : d ? 'filled' : 'empty' })}
          style={success ? { animationDelay: `${i * 70}ms` } : undefined}
        />
      ))}
    </div>
  );
}
