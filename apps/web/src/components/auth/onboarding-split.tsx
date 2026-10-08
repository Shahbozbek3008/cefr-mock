import type { ReactNode } from 'react';

type OnboardingSplitProps = { title: string; text: string; children: ReactNode; aside: ReactNode };

export function OnboardingSplit({ title, text, children, aside }: OnboardingSplitProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-5 pt-6 pb-16">
      <div className="grid w-full max-w-[920px] items-center gap-12 lg:grid-cols-[minmax(0,420px)_380px] lg:justify-between">
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-2">
            <h1 className="m-0 text-[34px] leading-[1.1] font-medium tracking-[-0.04em]">{title}</h1>
            <p className="m-0 text-[15px] leading-[1.55] text-ink-2">{text}</p>
          </div>
          {children}
        </div>
        <div className="w-full max-w-[380px] justify-self-center lg:justify-self-end">{aside}</div>
      </div>
    </div>
  );
}
