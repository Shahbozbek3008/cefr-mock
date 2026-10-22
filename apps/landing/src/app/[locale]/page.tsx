import { AiSection } from "@/components/ai-section";
import { CtaBanner } from "@/components/cta-banner";
import { FaqSection } from "@/components/faq-section";
import { FormatSection } from "@/components/format-section";
import { Hero } from "@/components/hero";
import { PricingSection } from "@/components/pricing-section";
import { ProductPreview } from "@/components/product-preview";
import { StatsBand } from "@/components/stats-band";
import { StepsSection } from "@/components/steps-section";
import { StructuredData } from "@/components/structured-data";
import { TestimonialsSection } from "@/components/testimonials-section";
import { initLocale, type LocaleParams } from "@cefr/ui/i18n/locale";

interface LandingPageProps {
  params: LocaleParams;
}

export default async function LandingPage({ params }: LandingPageProps) {
  const locale = await initLocale(params);
  return (
    <>
      <StructuredData locale={locale} />
      <Hero />
      <StatsBand />
      <ProductPreview />
      <FormatSection />
      <AiSection />
      <StepsSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <CtaBanner />
    </>
  );
}
