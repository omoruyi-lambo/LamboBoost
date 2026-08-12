"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export function CtaSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0B1220] py-24 text-white md:py-32">
      {/* Subtle background image for continuity */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/hero-bg.svg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-[#0B1220]/60" aria-hidden="true" />

      <div className="site-container">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-[720px] text-center"
        >
          <h2 className="font-display text-[2.3rem] font-bold leading-[1.08] tracking-[-0.03em] text-white md:text-[3rem]">
            Everything starts with your first order.
          </h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[16px] leading-8 text-[#CBD5E1]">
            Manage your digital marketing services from one simple platform.
          </p>
          <div className="mt-9">
            <Link href="/register" className="btn-primary h-12 px-8 text-[15px]">
              Get Started
              <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
