"use client";

import { motion } from "framer-motion";
import { ListChecks, Lock, Receipt, ShieldCheck, Wallet } from "lucide-react";

const items = [
  {
    title: "Secure payments",
    description:
      "Wallet funding goes through the platform's supported payment flow before any order is placed.",
    icon: ShieldCheck,
  },
  {
    title: "Wallet management",
    description:
      "Keep your balance separate from ordering and top up whenever you need to.",
    icon: Wallet,
  },
  {
    title: "Transaction history",
    description:
      "Every deposit, charge, and refund is recorded with a reference you can revisit at any time.",
    icon: Receipt,
  },
  {
    title: "Order tracking",
    description:
      "Follow every order's status and progress from your dashboard in real time.",
    icon: ListChecks,
  },
  {
    title: "Account protection",
    description:
      "Your account is protected with secure authentication and managed session access.",
    icon: Lock,
  },
];

export function PaymentsSection() {
  return (
    <section className="section-py bg-white">
      <div className="site-container">
        <div className="section-header">
          <span className="section-label">Security</span>
          <h2 className="section-heading">Security and payments, designed for clarity.</h2>
          <p className="section-subheading">
            A wallet-first flow keeps every payment and order action visible, traceable, and easy to
            review from the dashboard.
          </p>
        </div>

        <div className="mx-auto grid max-w-[940px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
              className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6"
            >
              <item.icon
                className="h-6 w-6 text-[#2563EB]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <h3 className="mt-4 text-[15px] font-semibold tracking-normal text-[#0F172A]">
                {item.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-6 text-[#64748B]">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
