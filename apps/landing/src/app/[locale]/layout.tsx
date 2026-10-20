import { MarketingFooter } from "@/components/footer";
import { MarketingHeader } from "@/components/header";
import { StickyCta } from "@/components/sticky-cta";
import { SEARCH_VERIFICATION, SITE_URL } from "@/constants/seo";
import { INDEXABLE_ROBOTS, OG_LOCALES } from "@cefr/ui/seo/constants";
import { geistMono, onest } from "@/lib/fonts";
import { languageAlternates, localePath } from "@/lib/seo";
import "@/styles/globals.css";
import { BRAND_NAME } from "@cefr/ui/components/logo";
import { initLocale, resolveLocale, type LocaleParams } from "@cefr/ui/i18n/locale";
import { routing } from "@cefr/ui/i18n/routing";
import { MotionProvider } from "@cefr/ui/motion/motion-provider";
import { NextNavigationProvider } from "@cefr/ui/navigation/next-navigation";
import { THEME_COLORS } from "@cefr/ui/theme/constants";
import { ThemeScript } from "@cefr/ui/theme/theme-script";
import { ThemeSync } from "@cefr/ui/theme/theme-sync";
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
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("title");
  const description = t("description");
  const url = localePath(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${BRAND_NAME}` },
    description,
    keywords: t("keywords").split(",").map((keyword) => keyword.trim()),
    applicationName: BRAND_NAME,
    authors: [{ name: BRAND_NAME, url: SITE_URL }],
    creator: BRAND_NAME,
    publisher: BRAND_NAME,
    category: "education",
    alternates: {
      canonical: url,
      languages: languageAlternates(),
    },
    openGraph: {
      type: "website",
      siteName: BRAND_NAME,
      title,
      description,
      url,
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALES[l]),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: INDEXABLE_ROBOTS,
    verification: {
      google: SEARCH_VERIFICATION.google,
      yandex: SEARCH_VERIFICATION.yandex,
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
    <html lang={locale} className={`${onest.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeSync />
        <NextIntlClientProvider>
          <NextNavigationProvider>
            <MotionProvider>
              <div className="min-h-dvh overflow-x-clip bg-bg max-md:pb-[120px]">
                <MarketingHeader />
                <main>{children}</main>
                <MarketingFooter />
                <StickyCta />
              </div>
            </MotionProvider>
          </NextNavigationProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
