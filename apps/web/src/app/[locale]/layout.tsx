import { MotionProvider } from "@/components/motion/motion-provider";
import { AppProviders } from "@/components/providers/app-providers";
import { BRAND_NAME } from "@/components/ui/logo";
import { routing } from "@/i18n/routing";
import { geistMono, onest } from "@/lib/fonts";
import { initLocale, resolveLocale, type LocaleParams } from "@/lib/i18n";
import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: LocaleParams;
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: await resolveLocale(params),
    namespace: "metadata",
  });
  return {
    title: { default: t("title"), template: `%s · ${BRAND_NAME}` },
    description: t("description"),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale ? "/" : `/${l}`,
        ]),
      ),
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#FAFAFA",
  width: "device-width",
  initialScale: 1,
};

interface LocaleLayoutProps {
  children: ReactNode;
  params: LocaleParams;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const locale = await initLocale(params);
  return (
    <html lang={locale} className={`${onest.variable} ${geistMono.variable}`}>
      <body>
        <NextIntlClientProvider>
          <MotionProvider>
            <AppProviders>{children}</AppProviders>
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
