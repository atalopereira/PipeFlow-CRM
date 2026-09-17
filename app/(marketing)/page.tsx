import { LandingCta } from "@/components/marketing/landing-cta";
import { LandingFeatures } from "@/components/marketing/landing-features";
import { LandingFooter } from "@/components/marketing/landing-footer";
import { LandingHero } from "@/components/marketing/landing-hero";
import { LandingNav } from "@/components/marketing/landing-nav";
import { LandingPricing } from "@/components/marketing/landing-pricing";
import { LandingStats } from "@/components/marketing/landing-stats";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNav />
      <main className="flex-1">
        <LandingHero />
        <LandingStats />
        <LandingFeatures />
        <LandingPricing />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
