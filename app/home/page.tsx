import { Legacy83HeroCarousel } from "@/components/marketing/legacy83-hero-carousel";
import { Legacy83ServicesOverview } from "@/components/marketing/legacy83-services-overview";
import { Legacy83StatsSection } from "@/components/marketing/legacy83-stats-section";
import { Legacy83HowItWorks } from "@/components/marketing/legacy83-how-it-works";
import { Legacy83Testimonials } from "@/components/marketing/legacy83-testimonials";
import { Legacy83FAQSection } from "@/components/marketing/legacy83-faq-section";
import { Legacy83CTASection } from "@/components/marketing/legacy83-cta-section";

export default function HomeMarketingPage() {
  return (
    <>
      <Legacy83HeroCarousel />
      <Legacy83ServicesOverview />
      <Legacy83HowItWorks />
      <Legacy83StatsSection />
      <Legacy83Testimonials />
      <Legacy83FAQSection />
      <Legacy83CTASection />
    </>
  );
}
