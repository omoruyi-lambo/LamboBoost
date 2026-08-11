import type { Metadata } from "next";
import { PricingSection } from "@/features/landing/components/pricing-section";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${APP_NAME} Pricing - Pay Only for What You Use`,
  description: "Simple, transparent pricing for every service and order.",
};

export default function PricingPage() {
  return (
    <div className="pt-16">
      <PricingSection />
    </div>
  );
}
