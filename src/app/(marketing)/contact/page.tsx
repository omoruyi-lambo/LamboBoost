import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the LamboBoost team.",
};

export default function ContactPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="container max-w-xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-navy-900 mb-3">
          Contact us
        </h1>
        <p className="text-muted-foreground mb-10">
          Have a question or need help? We respond within a few hours.
        </p>
        <div className="space-y-4">
          {[
            { label: "General enquiries", value: "hello@lamboboost.com" },
            { label: "Support", value: "support@lamboboost.com" },
            { label: "Business & partnerships", value: "business@lamboboost.com" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-border p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
              <a href={`mailto:${value}`} className="text-primary hover:underline font-medium">{value}</a>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          For order-related issues, please{" "}
          <a href="/dashboard/support" className="text-primary hover:underline">open a support ticket</a>{" "}
          from your dashboard for the fastest response.
        </p>
      </div>
    </div>
  );
}
