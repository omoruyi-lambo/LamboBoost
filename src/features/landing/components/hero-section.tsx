"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ProductMockup } from "./product-mockup";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0B1220] text-white">
      {/* Abstract technology background image */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.svg')" }}
        aria-hidden="true"
      />
      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 -z-10 bg-[#0B1220]/70" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-b from-transparent to-[#0B1220]"
        aria-hidden="true"
      />

      {/* Split top row: writeup left, image right */}
      <div className="site-container grid min-h-[80svh] items-center gap-10 pb-16 pt-28 md:pt-32 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
        {/* Image — right */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="order-2 min-w-0"
        >
          <div className="overflow-hidden rounded-[32px] border border-white/10 shadow-[0_26px_80px_rgba(2,6,23,0.5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero-visual.svg" alt="Abstract technology illustration" className="h-auto w-full" />
          </div>
        </motion.div>

        {/* Writeup — left */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="order-1 text-center lg:text-left"
        >
          <h1 className="font-display text-[2.85rem] font-bold leading-[1.04] tracking-[-0.03em] text-white sm:text-[3.6rem] md:text-[4rem] lg:text-[3.4rem] xl:text-[4rem]">
            Grow Your Social Presence,
            <span className="block text-sky-400">Smarter.</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-[540px] text-base leading-8 text-[#CBD5E1] sm:text-lg lg:mx-0"
          >
            LamboBoost gives you one simple platform to discover, purchase, and manage digital
            marketing services.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.55, ease: "easeOut" }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
          >
            <Link href="/register" className="btn-primary h-12 px-7 text-sm">
              Get Started
              <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              href="/services"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-white/20 bg-white/5 px-7 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/10"
            >
              Explore Services
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Product visual — full width below (unchanged) */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.6, ease: "easeOut" }}
        className="site-container relative z-10 pb-16 md:pb-24"
      >
        <div className="mx-auto w-full max-w-[1080px]">
          <ProductMockup />
        </div>
      </motion.div>
    </section>
  );
}
