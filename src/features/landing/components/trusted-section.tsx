"use client";

import { motion } from "framer-motion";
import { PLATFORMS } from "@/lib/constants";
import { BrandIcon } from "@/components/icons/brand-icon";

export function TrustedSection() {
  return (
    <section className="border-b border-[#E2E8F0] bg-white py-12 md:py-14">
      <div className="site-container">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94A3B8]">
          Works with the platforms you use
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 md:gap-x-14">
          {PLATFORMS.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.04, duration: 0.3, ease: "easeOut" }}
              className="flex items-center gap-2.5 text-[#94A3B8] transition-colors hover:text-[#64748B]"
            >
              <BrandIcon name={platform.slug} className="h-[18px] w-[18px]" />
              <span className="text-[15px] font-semibold tracking-tight">{platform.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
