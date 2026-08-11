"use client";

import { motion } from "framer-motion";
import { PLATFORMS } from "@/lib/constants";
import { BrandIcon } from "@/components/icons/brand-icon";

export function TrustedSection() {
  return (
    <section className="bg-[#F8FAFC] pb-16 pt-24 md:pb-20 md:pt-28">
      <div className="site-container">
        <div className="mx-auto max-w-[720px] text-center">
          <span className="section-label">Supported platforms</span>
          <h2 className="section-heading">Manage services across the platforms you use.</h2>
          <p className="section-subheading">
            Browse digital marketing services by platform, create orders, fund your wallet,
            and track everything from one platform.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {PLATFORMS.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.04, duration: 0.35, ease: "easeOut" }}
              className="flex h-28 flex-col items-center justify-center rounded-3xl border border-[#E2E8F0] bg-white px-4 text-center shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-[#EFF6FF] text-[#2563EB]">
                <BrandIcon name={platform.slug} className="h-5 w-5" />
              </div>
              <span className="text-[13px] font-semibold text-[#0F172A]">{platform.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
