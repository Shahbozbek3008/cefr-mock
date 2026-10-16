import { AppProviders } from "@/components/providers/app-providers";
import { LANDING_URL } from "@/constants/routes";
import { SEARCH_VERIFICATION, SITE_URL } from "@/constants/seo";
import { geistMono, onest } from "@/lib/fonts";
import "@/styles/globals.css";
import type { LocaleLayoutProps } from "@/types/pages";
import { BRAND_NAME } from "@cefr/ui/components/logo";
import {
  initLocale,
  resolveLocale,
  type LocaleParams,
} from "@cefr/ui/i18n/locale";
import { routing } from "@cefr/ui/i18n/routing";
import { MotionProvider } from "@cefr/ui/motion/motion-provider";
import { OG_LOCALES, PRIVATE_ROBOTS } from "@cefr/ui/seo/constants";
import { THEME_COLORS } from "@cefr/ui/theme/constants";
import { ThemeScript } from "@cefr/ui/theme/theme-script";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface MetadataParams {
  params: LocaleParams;
}

export async function generateMetadata({
  params,
}: MetadataParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("title");
  const description = t("description");

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${BRAND_NAME}` },
    description,
    keywords: t("keywords")
      .split(",")
      .map((keyword) => keyword.trim()),
    applicationName: BRAND_NAME,
    authors: [{ name: BRAND_NAME, url: LANDING_URL }],
    creator: BRAND_NAME,
    publisher: BRAND_NAME,
    category: "education",
    robots: PRIVATE_ROBOTS,
    openGraph: {
      type: "website",
      siteName: BRAND_NAME,
      title,
      description,
      locale: OG_LOCALES[locale],
    },
    twitter: { card: "summary_large_image", title, description },
    verification: {
      google: SEARCH_VERIFICATION.google,
      yandex: SEARCH_VERIFICATION.yandex,
    },
    appleWebApp: {
      capable: true,
      title: BRAND_NAME,
      statusBarStyle: "default",
    },
    formatDetection: { telephone: false, email: false, address: false },
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
    <html
      lang={locale}
      className={`${onest.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
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
