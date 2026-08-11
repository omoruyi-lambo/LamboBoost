import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faListCheck,
  faReceipt,
  faShieldHalved,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";

const items = [
  {
    title: "Secure Payments",
    description: "Fund your account through the platform payment flow before placing orders.",
    icon: faCreditCard,
  },
  {
    title: "Wallet Protection",
    description: "Use wallet balance for orders and keep funding separate from service selection.",
    icon: faShieldHalved,
  },
  {
    title: "Order Tracking",
    description: "Follow each order status from your dashboard after checkout.",
    icon: faListCheck,
  },
  {
    title: "Transaction History",
    description: "Review deposits, charges, and references in a persistent activity log.",
    icon: faReceipt,
  },
];

export function PaymentsSection() {
  return (
    <section className="section-py bg-[#F8FAFC]">
      <div className="site-container">
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <span className="section-label">Security & payments</span>
            <h2 className="section-heading text-left">Security and payments, designed for clarity.</h2>
            <p className="section-subheading">
              The wallet-first flow keeps every payment and order action visible, traceable,
              and easy to review from the dashboard.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {items.map((item) => (
                <div key={item.title} className="rounded-lg border border-[#E2E8F0] bg-white p-5">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-[#BFDBFE] bg-[#EFF6FF]">
                    <FontAwesomeIcon icon={item.icon} className="h-4.5 w-4.5 text-[#2563EB]" aria-hidden="true" />
                  </div>
                  <h3 className="text-[15px] font-semibold tracking-normal text-[#0F172A]">{item.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-6 text-[#64748B]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(2,6,23,0.04)]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <p className="text-[13px] font-semibold text-[#0F172A]">Wallet Overview</p>
                <p className="text-[12px] text-[#64748B]">Example dashboard panel</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                <FontAwesomeIcon icon={faWallet} className="h-4.5 w-4.5" aria-hidden="true" />
              </div>
            </div>
            <div className="grid gap-3 py-5 sm:grid-cols-2">
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <p className="text-[12px] text-[#64748B]">Available balance</p>
                <p className="mt-2 font-display text-2xl font-bold tracking-normal text-[#0F172A]">NGN 48,200</p>
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <p className="text-[12px] text-[#64748B]">Last deposit</p>
                <p className="mt-2 font-display text-2xl font-bold tracking-normal text-[#0F172A]">NGN 20,000</p>
              </div>
            </div>
            <div className="space-y-3 border-t border-[#E2E8F0] pt-4">
              {["Payment initialized", "Wallet credited", "Transaction recorded"].map((label) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
                  <span className="text-[13px] text-[#334155]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
