"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ProductMockup } from "./product-mockup";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0B1220] pt-28 text-white md:pt-32">
      <Image
        src="/hero-bg.png"
        alt="Abstract technology network background"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-40"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#0B1220]/80" aria-hidden="true" />

      <div className="site-container relative z-10">
        <div className="mx-auto grid max-w-[1040px] gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="font-display text-[3.4rem] font-bold leading-[0.95] tracking-[-0.03em] text-white sm:text-[4.3rem] lg:text-[5rem]"
            >
              Grow Your Social Presence,
              <span className="block text-[#D7E9FF]">Smarter.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.55, ease: "easeOut" }}
              className="mx-auto mt-6 max-w-[620px] text-base leading-8 text-[#CBD5E1] sm:text-xl"
            >
              LamboBoost gives you one simple platform to discover, purchase, and manage digital
              marketing services.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.55, ease: "easeOut" }}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-start"
            >
              <Link href="/register" className="btn-primary h-12 px-7 text-sm">
                Get Started
                <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/services"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/20 bg-white/10 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/15"
              >
                Explore Services
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.6, ease: "easeOut" }}
            className="mx-auto w-full max-w-[900px] lg:max-w-none"
          >
            <ProductMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
