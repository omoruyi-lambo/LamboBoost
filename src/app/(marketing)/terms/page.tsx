import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="container max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-navy-900 mb-8">Terms of Service</h1>
        <div className="space-y-6 text-muted-foreground leading-relaxed text-sm">
          <p>Last updated: January 2025</p>
          <section>
            <h2 className="font-display text-xl font-semibold text-navy-900 mb-2">1. Acceptance</h2>
            <p>By using LamboBoost, you agree to these terms. If you do not agree, do not use the platform.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-navy-900 mb-2">2. Services</h2>
            <p>LamboBoost provides digital marketing services. We make no guarantees about outcomes or results. Delivery times are estimates.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-navy-900 mb-2">3. Payments & Refunds</h2>
            <p>Wallet deposits are non-refundable to external payment methods. Failed orders are refunded to your LamboBoost wallet.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-navy-900 mb-2">4. Prohibited use</h2>
            <p>You may not use LamboBoost to violate any platform terms of service, engage in fraud, or conduct illegal activities.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-navy-900 mb-2">5. Contact</h2>
            <p>For legal inquiries, contact <a href="mailto:legal@lamboboost.com" className="text-primary hover:underline">legal@lamboboost.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
