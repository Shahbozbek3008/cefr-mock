import { useTranslations } from 'next-intl';
import { AppleIcon, GoogleIcon } from '@/components/ui/brand-icons';

const PROVIDERS = [
  { key: 'google', mark: <GoogleIcon size={18} /> },
  { key: 'apple', mark: <AppleIcon size={18} className="-mt-0.5 text-ink" /> },
] as const;

export function SocialButtons() {
  const t = useTranslations('auth');
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {PROVIDERS.map((p) => (
        <button key={p.key} type="button" className="flex h-12 items-center justify-center gap-2.5 rounded-[14px] bg-surface px-4 text-sm font-medium shadow-inset transition-colors duration-(--t-fast) hover:bg-bg-app">
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
