import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="container max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-navy-900 mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-muted-foreground leading-relaxed text-sm">
          <p>Last updated: January 2025</p>
          <section>
            <h2 className="font-display text-xl font-semibold text-navy-900 mb-2">1. Information we collect</h2>
            <p>We collect your name, email address, and payment information when you register and make purchases. We also collect usage data to improve our services.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-navy-900 mb-2">2. How we use your information</h2>
            <p>We use your information to process orders, send transaction confirmations, provide support, and improve our platform. We do not sell your data to third parties.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-navy-900 mb-2">3. Data security</h2>
            <p>All data is encrypted in transit and at rest. Passwords are hashed using bcrypt. Payment processing is handled by PCI DSS compliant processors.</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-semibold text-navy-900 mb-2">4. Contact</h2>
            <p>For privacy inquiries, contact <a href="mailto:privacy@lamboboost.com" className="text-primary hover:underline">privacy@lamboboost.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
