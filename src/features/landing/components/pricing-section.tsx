import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const included = [
  "Access to the full service catalog",
  "Real-time order tracking",
  "Flexible wallet balance payments",
  "Complete transaction history",
  "Support ticket access",
  "No monthly subscription fees",
];

export function PricingSection() {
  return (
    <section className="section-py bg-white" id="pricing" aria-labelledby="pricing-heading">
      <div className="site-container">
        <div className="mx-auto max-w-[640px] text-center">
          <span className="section-label">Pricing</span>
          <h2 id="pricing-heading" className="section-heading">
            Transparent pricing designed for fast campaigns.
          </h2>
          <p className="section-subheading mt-4">
            Pay only for the services you use. Every cost is shown before you confirm and your wallet balance makes checkout effortless.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[620px]">
          <div className="rounded-[32px] border border-[#E2E8F0] bg-[#F8FAFC] p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <div className="mb-7 border-b border-[#E2E8F0] pb-6">
              <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">
                What you get
              </p>
              <p className="text-[14px] leading-7 text-[#475569]">
                Everything you need to manage orders, wallet funding, and campaign performance from one dashboard.
              </p>
            </div>

            <ul className="mb-8 space-y-4" role="list">
              {included.map((item) => (
                <li key={item} className="flex gap-3 text-[14px] leading-7 text-[#334155]">
                  <FontAwesomeIcon icon={faCircleCheck} className="mt-1 h-4 w-4 flex-shrink-0 text-[#2563EB]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-[20px] bg-[#2563EB] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
            >
              Start with a free account
              <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <p className="mt-4 text-center text-[13px] text-[#64748B]">
            Save time with pay-as-you-go access and get service pricing before you confirm every order.
          </p>
        </div>
      </div>
    </section>
  );
}
