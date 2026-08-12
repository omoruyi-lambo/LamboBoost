"use client";

import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  BarChart3,
  Headphones,
  Layers,
  ShoppingCart,
  Wallet,
} from "lucide-react";

const features = [
  {
    title: "Simple Ordering",
    description:
      "Pick a service, enter your link and quantity, and confirm. Your order starts processing right away.",
    icon: ShoppingCart,
  },
  {
    title: "Secure Wallet",
    description:
      "Fund your account once and use your balance across every order without repeating payment details.",
    icon: Wallet,
  },
  {
    title: "Order Tracking",
    description:
      "Follow each order from pending to completed with live status and progress in your dashboard.",
    icon: BarChart3,
  },
  {
    title: "Multiple Services",
    description:
      "Access a growing catalog across Instagram, TikTok, YouTube, Facebook, Telegram, and more.",
    icon: Layers,
  },
  {
    title: "Transaction History",
    description:
      "Every deposit, payment, and refund is recorded in a clear, reviewable ledger.",
    icon: ArrowLeftRight,
  },
  {
    title: "Customer Support",
    description:
      "Open a ticket directly from your dashboard and keep every conversation connected to your account.",
    icon: Headphones,
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
            A focused workspace for ordering, wallet funding, tracking, and support.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.05, duration: 0.36, ease: "easeOut" }}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-7 transition-shadow hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
            >
              <feature.icon
                className="h-6 w-6 text-[#2563EB]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <h3 className="mt-5 text-[17px] font-semibold tracking-normal text-[#0F172A]">
                {feature.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-7 text-[#64748B]">{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
