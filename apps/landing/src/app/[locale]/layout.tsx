import { MarketingFooter } from "@/components/footer";
import { MarketingHeader } from "@/components/header";
import { StickyCta } from "@/components/sticky-cta";
import { geistMono, onest } from "@/lib/fonts";
import "@/styles/globals.css";
import { BRAND_NAME } from "@cefr/ui/components/logo";
import { initLocale, resolveLocale, type LocaleParams } from "@cefr/ui/i18n/locale";
import { routing } from "@cefr/ui/i18n/routing";
import { MotionProvider } from "@cefr/ui/motion/motion-provider";
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
            <div className="min-h-dvh overflow-x-clip bg-bg max-md:pb-[120px]">
              <MarketingHeader />
              <main>{children}</main>
              <MarketingFooter />
              <StickyCta />
            </div>
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
