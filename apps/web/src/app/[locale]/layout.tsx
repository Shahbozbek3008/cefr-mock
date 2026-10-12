import { MotionProvider } from "@cefr/ui/motion/motion-provider";
import { AppProviders } from "@/components/providers/app-providers";
import { BRAND_NAME } from "@cefr/ui/components/logo";
import { routing } from "@cefr/ui/i18n/routing";
import { geistMono, onest } from "@/lib/fonts";
import { initLocale, resolveLocale, type LocaleParams } from "@cefr/ui/i18n/locale";
import "@/styles/globals.css";
import { THEME_COLORS } from "@cefr/ui/theme/constants";
import { ThemeScript } from "@cefr/ui/theme/theme-script";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { LocaleLayoutProps } from '@/types/pages';

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLORS.dark },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const locale = await initLocale(params);
  return (
    <html lang={locale} className={`${onest.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
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
