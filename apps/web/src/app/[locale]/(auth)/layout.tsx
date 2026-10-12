import { initLocale } from "@cefr/ui/i18n/locale";
import type { AuthLayoutProps } from '@/types/pages';

export default async function AuthLayout({
  children,
  params,
}: AuthLayoutProps) {
  await initLocale(params);
  return <main className="min-h-dvh bg-bg">{children}</main>;
}
