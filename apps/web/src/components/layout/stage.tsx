import type { ReactNode } from 'react';

export function Stage({ topBar, children, glow = false }: { topBar?: ReactNode; children: ReactNode; glow?: boolean }) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-bg">
      <div className="grid-backdrop pointer-events-none absolute inset-0 bg-size-[56px_56px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000,transparent_75%)]" />
      {glow && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="absolute top-[20%] left-1/2 size-[640px] -translate-x-1/2 animate-aurora rounded-full bg-[oklch(0.95_0.07_135/.9)] blur-[100px]" />
          <span className="absolute top-[45%] left-[30%] size-[360px] animate-aurora rounded-full bg-[oklch(0.93_0.04_258/.7)] blur-[90px] [animation-delay:-8s]" />
        </div>
      )}
      {topBar}
      <div className="relative flex flex-1 animate-fade-up flex-col">{children}</div>
    </div>
  );
}
