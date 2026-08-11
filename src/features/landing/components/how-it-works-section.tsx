"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faListCheck, faUserPlus } from "@fortawesome/free-solid-svg-icons";

const steps = [
  {
    title: "Create your account",
    description: "Register, sign in, and open your LamboBoost dashboard.",
    icon: faUserPlus,
  },
  {
    title: "Fund your wallet",
    description: "Add funds through the secure payment flow and keep your balance ready.",
    icon: faCreditCard,
  },
  {
    title: "Place and track orders",
    description: "Choose a service, submit details, and monitor every order status update.",
    icon: faListCheck,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-py bg-[#F8FAFC]">
      <div className="site-container">
        <div className="section-header">
          <span className="section-label">How it works</span>
          <h2 className="section-heading">From signup to order success in three easy steps.</h2>
          <p className="section-subheading">
            The LamboBoost workflow is built to keep onboarding fast, wallet funding clear, and order tracking transparent.
          </p>
        </div>

        <div className="relative grid gap-6 md:grid-cols-3">
          <div className="absolute left-1/2 top-16 hidden h-[calc(100%-4rem)] w-px bg-[#E2E8F0] md:block" aria-hidden="true" />
          {steps.map((step, index) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
              className="relative rounded-[28px] border border-[#E2E8F0] bg-white p-8 text-center shadow-[0_16px_32px_rgba(15,23,42,0.05)]"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
                <FontAwesomeIcon icon={step.icon} className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="mx-auto mt-6 flex h-11 w-11 items-center justify-center rounded-full border border-[#2563EB] bg-white text-sm font-semibold text-[#2563EB]">
                {index + 1}
              </div>
              <h3 className="mt-6 text-[18px] font-semibold tracking-normal text-[#0F172A]">{step.title}</h3>
              <p className="mt-4 text-[15px] leading-7 text-[#64748B]">{step.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
