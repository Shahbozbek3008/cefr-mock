import { LANDING_URL } from "@/constants/routes";
import { SITE_URL } from "@/constants/seo";
import { absoluteUrl, localePath, serializeJsonLd } from "@/lib/seo";
import { BRAND_NAME } from "@cefr/ui/components/logo";
import { routing, type Locale } from "@cefr/ui/i18n/routing";
import { PLANS } from "@cefr/ui/lib/plans";
import { PRICE_CURRENCY } from "@cefr/ui/seo/constants";
import { getTranslations } from "next-intl/server";

interface StructuredDataProps {
  locale: Locale;
  path: string;
}

export async function StructuredData({ locale, path }: StructuredDataProps) {
  const [tm, tp] = await Promise.all([
    getTranslations({ locale, namespace: "metadata" }),
    getTranslations({ locale, namespace: "plans" }),
  ]);
  const pageUrl = absoluteUrl(localePath(locale, path));
  const landingOrganizationId = `${LANDING_URL.replace(/\/+$/, "")}/#organization`;

  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${SITE_URL}/#app`,
    name: BRAND_NAME,
    url: pageUrl,
    description: tm("appDescription"),
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript",
    inLanguage: [...routing.locales],
    image: absoluteUrl(`/${locale}/opengraph-image`),
    publisher: {
      "@type": "Organization",
      "@id": landingOrganizationId,
      name: BRAND_NAME,
      url: LANDING_URL,
    },
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: 0,
        priceCurrency: PRICE_CURRENCY,
      },
      ...PLANS.map((plan) => ({
        "@type": "Offer",
        name: tp(`${plan.id}.name`),
        price: plan.price,
        priceCurrency: PRICE_CURRENCY,
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
