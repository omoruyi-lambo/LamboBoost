import type { Metadata } from "next";
import { HeroSection } from "@/features/landing/components/hero-section";
import { TrustedSection } from "@/features/landing/components/trusted-section";
import { FeaturesSection } from "@/features/landing/components/features-section";
import { ShowcaseSection } from "@/features/landing/components/showcase-section";
import { HowItWorksSection } from "@/features/landing/components/how-it-works-section";
import { ServicesPreviewSection } from "@/features/landing/components/services-preview-section";
import { PricingSection } from "@/features/landing/components/pricing-section";
import { PaymentsSection } from "@/features/landing/components/payments-section";
import { FaqSection } from "@/features/landing/components/faq-section";
import { CtaSection } from "@/features/landing/components/cta-section";
import { APP_DESCRIPTION, APP_NAME, APP_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${APP_NAME} - Digital Marketing Services Platform`,
  description: APP_DESCRIPTION,
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    title: `${APP_NAME} - Digital Marketing Services Platform`,
    description: APP_DESCRIPTION,
    url: APP_URL,
    siteName: APP_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - Digital Marketing Services Platform`,
    description: APP_DESCRIPTION,
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustedSection />
      <FeaturesSection />
      <ShowcaseSection />
      <HowItWorksSection />
      <ServicesPreviewSection />
      <PricingSection />
      <PaymentsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
