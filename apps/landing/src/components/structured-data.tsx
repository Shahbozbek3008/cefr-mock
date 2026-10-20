import { FAQ_KEYS } from "@/constants/sections";
import { SITE_URL } from "@/constants/seo";
import { absoluteUrl, localePath, serializeJsonLd } from "@/lib/seo";
import { BRAND_NAME } from "@cefr/ui/components/logo";
import { routing, type Locale } from "@cefr/ui/i18n/routing";
import { PLANS } from "@cefr/ui/lib/plans";
import { PRICE_CURRENCY } from "@cefr/ui/seo/constants";
import { getTranslations } from "next-intl/server";

interface StructuredDataProps {
  locale: Locale;
}

const stripTags = (text: string) =>
  text
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

export async function StructuredData({ locale }: StructuredDataProps) {
  const [tm, tf, tp] = await Promise.all([
    getTranslations({ locale, namespace: "metadata" }),
    getTranslations({ locale, namespace: "landing.faq.items" }),
    getTranslations({ locale, namespace: "plans" }),
  ]);

  const pageUrl = absoluteUrl(localePath(locale));
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: BRAND_NAME,
        url: absoluteUrl("/"),
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/apple-icon"),
          width: 180,
          height: 180,
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: absoluteUrl("/"),
        name: BRAND_NAME,
        inLanguage: [...routing.locales],
        publisher: { "@id": organizationId },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: tm("title"),
        description: tm("description"),
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: absoluteUrl(`/${locale}/opengraph-image`),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        inLanguage: locale,
        mainEntity: FAQ_KEYS.map((key) => ({
          "@type": "Question",
          name: stripTags(tf.raw(`${key}.q`) as string),
          acceptedAnswer: {
            "@type": "Answer",
            text: stripTags(tf.raw(`${key}.a`) as string),
          },
        })),
      },
      {
        "@type": "Product",
        "@id": `${pageUrl}#product`,
        name: `${BRAND_NAME} Pro`,
        description: tm("productDescription"),
        image: absoluteUrl(`/${locale}/opengraph-image`),
        brand: { "@type": "Brand", name: BRAND_NAME },
        offers: PLANS.map((plan) => ({
          "@type": "Offer",
          name: tp(`${plan.id}.name`),
          price: plan.price,
          priceCurrency: PRICE_CURRENCY,
          availability: "https://schema.org/InStock",
          url: `${pageUrl}#pricing`,
          seller: { "@id": organizationId },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
