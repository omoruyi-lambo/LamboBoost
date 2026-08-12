"use client";

import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  Gauge,
  Layers,
  LifeBuoy,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import { ProductMockup } from "./product-mockup";

const dashboardAreas = [
  { label: "Overview", text: "Wallet, order counts, and recent activity.", icon: Gauge },
  { label: "Wallet", text: "Fund your account and review balance activity.", icon: Wallet },
  { label: "Orders", text: "Create and follow social media service orders.", icon: ShoppingCart },
  { label: "Services", text: "Browse platform categories and service options.", icon: Layers },
  { label: "Transactions", text: "See deposits and order charges in one place.", icon: ArrowLeftRight },
  { label: "Support", text: "Keep help requests organized and easy to revisit.", icon: LifeBuoy },
];

export function ShowcaseSection() {
  return (
    <section className="section-py overflow-hidden bg-white">
      <div className="site-container">
        <div className="mx-auto max-w-[680px] text-center">
          <span className="section-label">Dashboard showcase</span>
          <h2 className="section-heading">Your workflow. One powerful dashboard.</h2>
          <p className="section-subheading">
            LamboBoost keeps wallet funding, service selection, orders, transactions, and support
            all in one view.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-[860px] gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardAreas.map((area) => (
            <div
              key={area.label}
              className="flex items-start gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-4"
            >
              <area.icon
                className="mt-0.5 h-5 w-5 shrink-0 text-[#2563EB]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <div>
                <h3 className="text-[15px] font-semibold tracking-normal text-[#0F172A]">
                  {area.label}
                </h3>
                <p className="mt-1 text-[13.5px] leading-6 text-[#64748B]">{area.text}</p>
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto mt-12 w-full max-w-[1080px] md:mt-16"
        >
          <ProductMockup />
        </motion.div>
      </div>
    </section>
  );
}
