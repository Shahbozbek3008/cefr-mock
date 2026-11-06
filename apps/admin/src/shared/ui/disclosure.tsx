import type { ReactNode } from 'react';

type DisclosureProps = {
  summary: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function Disclosure({ summary, defaultOpen, children }: DisclosureProps) {
  return (
    <details open={defaultOpen}>
      <summary className="cursor-pointer text-[13px] font-medium text-ink-2">{summary}</summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}
