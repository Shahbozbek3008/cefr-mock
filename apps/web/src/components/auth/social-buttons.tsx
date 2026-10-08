import { useTranslations } from 'next-intl';

const PROVIDERS = [
  { key: 'google', mark: <span className="size-[18px] rounded-full bg-[conic-gradient(#ea4335_0_25%,#fbbc05_0_50%,#34a853_0_75%,#4285f4_0)]" /> },
  { key: 'apple', mark: <span className="size-[18px] rounded-[5px] bg-ink" /> },
] as const;

export function SocialButtons() {
  const t = useTranslations('auth');
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {PROVIDERS.map((p) => (
        <button key={p.key} type="button" className="flex h-12 items-center gap-2.5 rounded-[14px] bg-surface px-4 text-sm font-medium shadow-inset transition-colors duration-(--t-fast) hover:bg-bg-app">
          {p.mark}
          {t(p.key)}
        </button>
      ))}
    </div>
  );
}

export function OrDivider() {
  const t = useTranslations('auth');
  return (
    <div className="flex items-center gap-[14px] text-xs text-ink-3">
      <span className="h-px flex-1 bg-divider-muted" />
      {t('or')}
      <span className="h-px flex-1 bg-divider-muted" />
    </div>
  );
}
