import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { WhyUs } from "@/components/home/WhyUs";
import { IndustriesSection } from "@/components/home/IndustriesSection";
import { LiveStats } from "@/components/home/LiveStats";
import { CoverageMapLoader } from "@/components/home/CoverageMapLoader";
import { QuoteSection } from "@/components/home/QuoteSection";
import { TeamPreview } from "@/components/home/TeamPreview";
import { Testimonials } from "@/components/home/Testimonials";
import { CTASection } from "@/components/home/CTASection";
import { OrnamentDivider } from "@/components/shared/OrnamentDivider";
import {
  getPublishedHeroSlides,
  getPartners,
  getPublishedServices,
  getPublishedIndustries,
  getPublishedTestimonials,
  getActiveTeamMembers,
  getSiteSettings,
} from "@/lib/site-data";

export const revalidate = 60;

export default async function HomePage() {
  const [slides, partners, services, industries, testimonials, team, settings] =
    await Promise.all([
      getPublishedHeroSlides(),
      getPartners(),
      getPublishedServices(),
      getPublishedIndustries(),
      getPublishedTestimonials(),
      getActiveTeamMembers(),
      getSiteSettings(),
    ]);

  return (
    <>
      <Hero slides={slides} />
      <TrustBar partners={partners} settings={settings} />
      <ServicesGrid services={services} />
      <OrnamentDivider />
      <WhyUs />
      <IndustriesSection industries={industries} />
      <CoverageMapLoader />
      <LiveStats />
      <OrnamentDivider />
      <QuoteSection />
      <TeamPreview team={team} />
      <Testimonials items={testimonials} />
      <CTASection settings={settings} />
    </>
  );
}
