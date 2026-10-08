'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const format = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export function ResendTimer({ seconds = 60, onResend }: { seconds?: number; onResend?: () => Promise<unknown> }) {
  const t = useTranslations('auth.verify');
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);

  return (
    <span className="text-[13px] text-ink-2">
      {t('noCode')}{' '}
      {left > 0 ? (
        <>{t('resend')} <span className="font-mono text-ink">{format(left)}</span></>
      ) : (
        <button type="button" onClick={() => { setLeft(seconds); onResend?.().catch(() => undefined); }} className="font-medium text-green-text hover:text-green-hover">{t('resend')}</button>
      )}
    </span>
  );
}
