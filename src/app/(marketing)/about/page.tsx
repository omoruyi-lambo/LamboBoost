import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about LamboBoost and our mission.",
};

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="container max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-navy-900 mb-6">
          About LamboBoost
        </h1>
        <div className="prose prose-gray max-w-none space-y-5 text-muted-foreground leading-relaxed">
          <p className="text-lg text-foreground">
            LamboBoost is a premium digital marketing services platform built for
            creators, brands, and agencies who take their online presence seriously.
          </p>
          <p>
            We provide fast, reliable, and transparent social media growth services
            across all major platforms including Instagram, TikTok, YouTube,
            Twitter/X, Facebook, Spotify, LinkedIn, and Telegram.
          </p>
          <p>
            Our platform is built on a multi-provider architecture, meaning we
            work with multiple service providers to ensure the best quality and
            uptime for every order you place.
          </p>
          <p>
            Every transaction is secured, every order is tracked in real time,
            and our support team is available 24/7 to resolve any issues.
          </p>
          <h2 className="font-display text-2xl font-bold text-navy-900 mt-10">Our values</h2>
          <ul className="space-y-2">
            {[
              "Transparency — you always know what you're paying for",
              "Speed — orders start processing within minutes",
              "Security — your funds and data are always protected",
              "Support — real humans answer your tickets",
            ].map((v) => (
              <li key={v} className="flex items-start gap-2">
                <span className="text-primary mt-1">→</span>
                {v}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
