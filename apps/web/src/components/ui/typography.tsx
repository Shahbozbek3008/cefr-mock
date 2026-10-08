import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Reveal } from '@/components/motion/reveal';

export function Eyebrow({ className, ...rest }: ComponentProps<'span'>) {
  return <span className={cn('text-[13px] font-medium text-green-eyebrow', className)} {...rest} />;
}

export function MonoLabel({ className, ...rest }: ComponentProps<'span'>) {
  return <span className={cn('font-mono text-xs uppercase text-ink-3', className)} {...rest} />;
}

type SectionHeadingProps = { eyebrow: string; title: ReactNode; align?: 'start' | 'center'; className?: string; as?: 'h1' | 'h2' };

export function EyebrowPill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex h-7 items-center gap-2 self-start rounded-pill bg-surface pr-3 pl-2.5 text-[12.5px] font-medium text-green-eyebrow shadow-[0_0_0_1px_rgba(20,22,30,.07),0_1px_2px_rgba(20,22,30,.04)]', className)}>
      <span className="relative grid size-1.5 place-items-center">
        <span className="absolute size-1.5 animate-ping-soft rounded-full bg-green" />
        <span className="size-1.5 rounded-full bg-green" />
      </span>
      {children}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, align = 'start', className, as: Tag = 'h2' }: SectionHeadingProps) {
  return (
    <Reveal className={cn('flex flex-col gap-4 max-md:gap-3', align === 'center' && 'items-center text-center', className)}>
      <EyebrowPill className={cn(align === 'center' && 'self-center')}>{eyebrow}</EyebrowPill>
      <Tag className="m-0 text-[32px] leading-[1.05] font-medium tracking-[-0.045em] md:text-[clamp(34px,4vw,52px)] md:leading-[1.02]">{title}</Tag>
    </Reveal>
  );
}

type BigNumberProps = { value: ReactNode; max?: ReactNode; size: number; className?: string };

export function BigNumber({ value, max, size, className }: BigNumberProps) {
  return (
    <span className={cn('leading-none font-light tracking-[-0.055em]', className)} style={{ fontSize: size }}>
      {value}
      {max && <span className="ml-1 font-mono text-xs tracking-normal text-ink-3">{max}</span>}
    </span>
  );
}

export function PageTitle({ meta, title }: { meta?: ReactNode; title: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      {meta && <span className="text-[13px] text-ink-2">{meta}</span>}
      <h1 className="m-0 text-[30px] leading-[1.1] font-medium tracking-[-0.04em]">{title}</h1>
    </div>
  );
}

export function Breadcrumb({ items }: { items: readonly string[] }) {
  return (
    <>
      {items.map((item, i) => (
        <span key={item} className={i === items.length - 1 ? 'text-ink' : undefined}>
          {i > 0 && <span className="mx-1.5 text-ink-4">/</span>}
          {item}
        </span>
      ))}
    </>
  );
}
