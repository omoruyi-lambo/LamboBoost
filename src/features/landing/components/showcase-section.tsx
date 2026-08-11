"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightArrowLeft,
  faBoxOpen,
  faCartShopping,
  faCircleQuestion,
  faGaugeHigh,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { ProductMockup } from "./product-mockup";

const dashboardAreas = [
  { label: "Overview", text: "Wallet, order counts, and recent activity.", icon: faGaugeHigh },
  { label: "Wallet", text: "Fund your account and review balance activity.", icon: faWallet },
  { label: "Orders", text: "Create and follow social media service orders.", icon: faCartShopping },
  { label: "Services", text: "Browse platform categories and service options.", icon: faBoxOpen },
  { label: "Transactions", text: "See deposits and order charges in one place.", icon: faArrowRightArrowLeft },
  { label: "Support", text: "Keep help requests organized and easy to revisit.", icon: faCircleQuestion },
];

export function ShowcaseSection() {
  return (
    <section className="section-py overflow-hidden bg-white">
      <div className="site-container">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="section-label">Dashboard showcase</span>
            <h2 className="section-heading text-left">Your workflow. One powerful dashboard.</h2>
            <p className="section-subheading">
              LamboBoost keeps wallet funding, service selection, orders, transactions, and support all in one view.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {dashboardAreas.map((area) => (
                <div key={area.label} className="flex gap-3 rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-3xl border border-[#E2E8F0] bg-white text-[#2563EB]">
                    <FontAwesomeIcon icon={area.icon} className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold tracking-normal text-[#0F172A]">{area.label}</h3>
                    <p className="mt-1 text-[14px] leading-6 text-[#64748B]">{area.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 26 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-w-0"
          >
            <ProductMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
