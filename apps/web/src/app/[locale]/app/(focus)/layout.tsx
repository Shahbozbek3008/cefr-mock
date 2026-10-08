import type { ReactNode } from 'react';
import { initLocale, type LocaleParams } from '@/lib/i18n';

export default async function FocusLayout({ children, params }: { children: ReactNode; params: LocaleParams }) {
  await initLocale(params);
  return <div className="min-h-dvh bg-bg-app">{children}</div>;
}
