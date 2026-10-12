import { initLocale, type LocaleParams } from "@cefr/ui/i18n/locale";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  params: LocaleParams;
}

export default async function AuthLayout({
  children,
  params,
}: AuthLayoutProps) {
  await initLocale(params);
  return <main className="min-h-dvh bg-bg">{children}</main>;
}
