'use client';

import { useEffect, useRef, useState, type ComponentProps, type MouseEvent, type ReactNode } from 'react';
import { useLinkStatus } from 'next/link';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion, type TargetAndTransition, type Transition } from 'motion/react';
import { ArrowRight, CircleAlert } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import { EASE_OUT } from '@/lib/motion';
import { Icon } from './icon';
import { Spinner } from './spinner';
import { buttonVariants, type ButtonVariants } from './button-variants';

const INDICATOR_SIZE = { lg: 18, md: 16, sm: 16, xs: 15 } as const;
const SETTLE_MS = { success: 1400, error: 1400 } as const;
const MIN_LOADING_MS = 700;
const FILL_DURATION = 4.5;

type Status = 'idle' | 'loading' | 'success' | 'error';

type OwnProps = ButtonVariants & { icon?: ReactNode; children?: ReactNode };

const atLeast = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const SWAP = {
  initial: { y: 14, opacity: 0, filter: 'blur(3px)' },
  animate: { y: 0, opacity: 1, filter: 'blur(0px)' },
  exit: { y: -14, opacity: 0, filter: 'blur(3px)' },
  transition: { duration: 0.34, ease: EASE_OUT } satisfies Transition,
};

function Fill({ status }: { status: Status }) {
  const reduced = useReducedMotion();

  const target = (): TargetAndTransition => {
    if (status === 'loading') {
      return reduced
        ? { scaleX: 1, opacity: 0.7, transition: { duration: 0.2 } }
        : { scaleX: [0, 0.32, 0.9], opacity: 1, transition: { duration: FILL_DURATION, times: [0, 0.12, 1], ease: EASE_OUT } };
    }
    if (status === 'success') return { scaleX: 1, opacity: 1, transition: { duration: 0.35, ease: EASE_OUT } };
    return { opacity: 0, transition: { duration: 0.45, ease: EASE_OUT } };
  };

  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <motion.span
        className="absolute inset-0 origin-left bg-[linear-gradient(90deg,color-mix(in_oklab,currentColor_6%,transparent),color-mix(in_oklab,currentColor_18%,transparent))]"
        initial={false}
        animate={target()}
      >
        <span className="absolute inset-y-0 right-0 w-px bg-[color-mix(in_oklab,currentColor_45%,transparent)]" />
      </motion.span>
    </span>
  );
}

function SuccessMark({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeDasharray={24} className="animate-check-draw" />
    </svg>
  );
}

function Content({ icon, arrow, size, children, status = 'idle' }: OwnProps & { status?: Status }) {
  const t = useTranslations('common');
  const indicator = INDICATOR_SIZE[size ?? 'lg'];

  return (
    <>
      <Fill status={status} />
      <span
        className={cn(
          'relative flex flex-1 items-center [gap:inherit] [justify-content:inherit] transition-[opacity,translate,filter] duration-300 ease-out-expo',
          status !== 'idle' && '-translate-y-3 opacity-0 blur-[3px]',
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
      <AnimatePresence initial={false}>
        {status !== 'idle' && (
          <motion.span
            key={status}
            {...SWAP}
            aria-hidden
            className={cn('pointer-events-none absolute inset-0 flex items-center justify-center gap-2 overflow-hidden px-3 whitespace-nowrap', status === 'error' && 'animate-shake')}
          >
            {status === 'loading' && <Spinner size={indicator} />}
            {status === 'success' && <SuccessMark size={indicator} />}
            {status === 'error' && <Icon as={CircleAlert} size={indicator} strokeWidth={2} />}
            {status !== 'loading' && <span className="truncate">{t(status === 'success' ? 'done' : 'failed')}</span>}
          </motion.span>
        )}
      </AnimatePresence>
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
    Promise.allSettled([result, atLeast(MIN_LOADING_MS)]).then(([outcome]) =>
      settle(outcome.status === 'rejected' || outcome.value === false ? 'error' : 'success'),
    );
  };

  return (
    <button
      type={type}
      disabled={disabled && shown === 'idle'}
      aria-busy={busy || undefined}
      data-status={shown}
      className={cn(buttonVariants({ variant, size, arrow, block }), 'overflow-hidden', className)}
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
    <Link className={cn(buttonVariants({ variant, size, arrow, block }), 'overflow-hidden', className)} {...rest}>
      <LinkContent icon={icon} arrow={arrow} size={size}>{children}</LinkContent>
    </Link>
  );
}
