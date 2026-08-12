"use client";

import { motion } from "framer-motion";
import { CreditCard, ListChecks, MousePointerClick, UserPlus } from "lucide-react";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

const stepIcons = [UserPlus, CreditCard, MousePointerClick, ListChecks];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-py bg-[#F8FAFC]">
      <div className="site-container">
        <div className="section-header">
          <span className="section-label">How it works</span>
          <h2 className="section-heading">From signup to order success in four simple steps.</h2>
          <p className="section-subheading">
            A clean workflow that keeps onboarding fast, funding clear, and every order trackable.
          </p>
        </div>

        <div className="relative">
          {/* Thin connecting line across the steps (desktop) */}
          <div
            className="absolute inset-x-8 top-[25px] hidden h-px bg-[#E2E8F0] lg:block"
            aria-hidden="true"
          />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {HOW_IT_WORKS_STEPS.map((step, index) => {
              const Icon = stepIcons[index];
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.07, duration: 0.4, ease: "easeOut" }}
                  className="relative text-center lg:text-left"
                >
                  <div className="relative z-10 mx-auto flex h-[50px] w-[50px] items-center justify-center rounded-full border border-[#BFDBFE] bg-white lg:mx-0">
                    <Icon className="h-5 w-5 text-[#2563EB]" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <p className="mt-5 font-display text-[13px] font-semibold tracking-[0.14em] text-[#2563EB]">
                    {step.step}
                  </p>
                  <h3 className="mt-2 text-[17px] font-semibold tracking-normal text-[#0F172A]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-7 text-[#64748B]">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
