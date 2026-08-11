"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faChartLine,
  faHeadset,
  faLayerGroup,
  faWallet,
  faArrowRightArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const features = [
  {
    title: "Simple Ordering",
    description: "Browse the catalog, choose a service, and submit your order in one clean workflow.",
    icon: faCartShopping,
  },
  {
    title: "Secure Wallet",
    description: "Fund your account once and use wallet balance for every order.",
    icon: faWallet,
  },
  {
    title: "Order Tracking",
    description: "Monitor status updates and progress from pending to completion.",
    icon: faChartLine,
  },
  {
    title: "Multiple Services",
    description: "Access service categories across Instagram, TikTok, YouTube, Facebook, and Telegram.",
    icon: faLayerGroup,
  },
  {
    title: "Transaction History",
    description: "Review deposits, payments, and order charges in a persistent ledger.",
    icon: faArrowRightArrowLeft,
  },
  {
    title: "Customer Support",
    description: "Open a ticket directly from your dashboard whenever you need help.",
    icon: faHeadset,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="section-py bg-[#F8FAFC]">
      <div className="site-container">
        <div className="section-header">
          <span className="section-label">Features</span>
          <h2 className="section-heading">Everything you need to manage your digital marketing.</h2>
          <p className="section-subheading">
            A focused workspace for orders, wallet activity, service discovery, payments, and support.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.05, duration: 0.36, ease: "easeOut" }}
              className="rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-3xl border border-[#E2E8F0] bg-[#EFF6FF] text-[#2563EB]">
                <FontAwesomeIcon icon={feature.icon} className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-[18px] font-semibold tracking-normal text-[#0F172A]">{feature.title}</h3>
              <p className="mt-3 text-[14px] leading-7 text-[#64748B]">{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
