import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/constants";

const columnLabels: Record<keyof typeof FOOTER_LINKS, string> = {
  product: "Product",
  company: "Company",
  resources: "Resources",
  legal: "Legal",
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1220] text-white" aria-label="Site footer">
      <div className="site-container py-14 md:py-16">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-6 lg:gap-12">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="mb-4 inline-flex items-center gap-2.5" aria-label="LamboBoost home">
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect width="32" height="32" rx="8" fill="#2563EB" />
                <path
                  d="M8.5 23L14 9.5L19 17.5L21.5 13L24 23"
                  stroke="white"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-display text-[16px] font-bold tracking-normal text-white">LamboBoost</span>
            </Link>

            <p className="max-w-[250px] text-[13.5px] leading-relaxed text-white/55">
              Discover, purchase, and manage digital marketing services from one powerful platform.
            </p>
          </div>

          {(Object.keys(FOOTER_LINKS) as Array<keyof typeof FOOTER_LINKS>).map((column) => (
            <div key={column}>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-normal text-white/38">
                {columnLabels[column]}
              </p>
              <ul className="space-y-2.5" role="list">
                {FOOTER_LINKS[column].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[13.5px] text-white/60 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.08] pt-8 sm:flex-row">
          <p className="text-[12.5px] text-white/40">Copyright {year} LamboBoost. All rights reserved.</p>
          <p className="text-[12.5px] text-white/40">Payments and order history are managed in your dashboard.</p>
        </div>
      </div>
    </footer>
  );
}
