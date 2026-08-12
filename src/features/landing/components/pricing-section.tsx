"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Calculator, SlidersHorizontal, Wallet } from "lucide-react";

const points = [
  {
    title: "Per-service pricing",
    description:
      "Each service in the catalog shows its own unit rate. No tiers, no bundles — just the service you choose.",
    icon: Calculator,
  },
  {
    title: "Set your own quantity",
    description:
      "Every order has a minimum and maximum quantity. Your cost is the rate times the quantity you select.",
    icon: SlidersHorizontal,
  },
  {
    title: "Pay from your wallet",
    description:
      "Fund your wallet once and settle each order instantly with your balance. Top up whenever you need to.",
    icon: Wallet,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="section-py bg-[#F8FAFC]">
      <div className="site-container">
        <div className="section-header">
          <span className="section-label">Pricing</span>
          <h2 className="section-heading">Pay for what you need.</h2>
          <p className="section-subheading">
            LamboBoost has no subscription plans. You only pay for the services and quantities you
            actually order, and every cost is shown before you confirm.
          </p>
        </div>

        <div className="mx-auto max-w-[860px]">
          <div className="grid gap-5 sm:grid-cols-3">
            {points.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.06, duration: 0.36, ease: "easeOut" }}
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6"
              >
                <point.icon
                  className="h-6 w-6 text-[#2563EB]"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <h3 className="mt-4 text-[15px] font-semibold tracking-normal text-[#0F172A]">
                  {point.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-6 text-[#64748B]">{point.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
            className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-white px-6 py-5 sm:flex-row"
          >
            <p className="text-center text-[14px] leading-6 text-[#475569] sm:text-left">
              No monthly fees. No hidden charges. Create a free account and pay only when you place
              an order.
            </p>
            <Link href="/register" className="btn-primary h-11 shrink-0 px-6 text-[13px]">
              Get Started
              <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
