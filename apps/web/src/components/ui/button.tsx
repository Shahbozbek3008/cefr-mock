'use client';

import { useEffect, useRef, useState, type ComponentProps, type MouseEvent, type ReactNode } from 'react';
import { useLinkStatus } from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import { Icon } from './icon';
import { Spinner } from './spinner';
import { buttonVariants, type ButtonVariants } from './button-variants';

const INDICATOR_SIZE = { lg: 18, md: 16, sm: 16, xs: 14 } as const;
const SETTLE_MS = { success: 1100, error: 450 } as const;

type Status = 'idle' | 'loading' | 'success' | 'error';

type OwnProps = ButtonVariants & { icon?: ReactNode; children?: ReactNode };

function SuccessMark({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeDasharray={24} className="animate-check-draw" />
    </svg>
  );
}

function Content({ icon, arrow, size, children, status = 'idle' }: OwnProps & { status?: Status }) {
  const indicator = INDICATOR_SIZE[size ?? 'lg'];
  const covered = status === 'loading' || status === 'success';

  return (
    <>
      {status === 'loading' && (
        <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
          <span className="absolute inset-y-0 -inset-x-1/2 animate-btn-sweep bg-[linear-gradient(100deg,transparent_35%,color-mix(in_oklab,currentColor_16%,transparent)_50%,transparent_65%)]" />
        </span>
      )}
      {covered && (
        <span key={status} className="pointer-events-none absolute inset-0 grid animate-loading-in place-items-center">
          {status === 'loading' ? <Spinner size={indicator} /> : <SuccessMark size={indicator + 2} />}
        </span>
      )}
      <span
        className={cn(
          'flex flex-1 items-center [gap:inherit] [justify-content:inherit] transition-[opacity,filter,scale] duration-300 ease-out-expo',
          covered && 'scale-[.94] opacity-0 blur-[2px]',
        )}
      >
        {icon}
        {children}
        {arrow && (
          <Icon
            as={ArrowRight}
            size={size === 'lg' ? 17 : 16}
            strokeWidth={1.75}
            className="transition-transform duration-(--t-base) ease-out-expo group-hover/btn:translate-x-0.5"
          />
        )}
      </span>
    </>
  );
}

export type ButtonProps = OwnProps & Omit<ComponentProps<'button'>, keyof OwnProps | 'onClick'> & {
  loading?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => unknown;
};

const isPromise = (value: unknown): value is Promise<unknown> => typeof (value as Promise<unknown> | undefined)?.then === 'function';

export function Button({ variant, size, arrow, block, icon, className, children, loading, disabled, onClick, type = 'button', ...rest }: ButtonProps) {
  const [status, setStatus] = useState<Status>('idle');
  const mounted = useRef(true);
  const shown: Status = loading ? 'loading' : status;
  const busy = shown === 'loading';

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (status !== 'success' && status !== 'error') return;
    const timer = setTimeout(() => setStatus('idle'), SETTLE_MS[status]);
    return () => clearTimeout(timer);
  }, [status]);

  const settle = (next: Status) => {
    if (mounted.current) setStatus(next);
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (shown !== 'idle') return;
    const result = onClick?.(event);
    if (!isPromise(result)) return;
    setStatus('loading');
    result.then(
      (value) => settle(value === false ? 'error' : 'success'),
      () => settle('error'),
    );
  };

  return (
    <button
      type={type}
      disabled={disabled && shown === 'idle'}
      aria-busy={busy || undefined}
      data-status={shown}
      className={cn(buttonVariants({ variant, size, arrow, block }), shown === 'error' && 'animate-shake', className)}
      onClick={handleClick}
      {...rest}
    >
      <Content icon={icon} arrow={arrow} size={size} status={shown}>{children}</Content>
    </button>
  );
}

function LinkContent(props: OwnProps) {
  const { pending } = useLinkStatus();
  return <Content {...props} status={pending ? 'loading' : 'idle'} />;
}

export type ButtonLinkProps = OwnProps & Omit<ComponentProps<typeof Link>, keyof OwnProps>;

export function ButtonLink({ variant, size, arrow, block, icon, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={cn(buttonVariants({ variant, size, arrow, block }), className)} {...rest}>
      <LinkContent icon={icon} arrow={arrow} size={size}>{children}</LinkContent>
    </Link>
  );
}
