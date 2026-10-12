import { initLocale, type LocaleParams } from '@cefr/ui/i18n/locale';
import { Hero } from '@/components/hero';
import { StatsBand } from '@/components/stats-band';
import { ProductPreview } from '@/components/product-preview';
import { FormatSection } from '@/components/format-section';
import { AiSection } from '@/components/ai-section';
import { StepsSection } from '@/components/steps-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { PricingSection } from '@/components/pricing-section';
import { FaqSection } from '@/components/faq-section';
import { CtaBanner } from '@/components/cta-banner';

export default async function LandingPage({ params }: { params: LocaleParams }) {
  await initLocale(params);
  return (
    <>
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
