"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export function CtaSection() {
  return (
    <section className="bg-[#0B1220] py-20 text-white md:py-24">
      <div className="site-container">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mx-auto max-w-[760px] rounded-[32px] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-[0_24px_70px_rgba(0,0,0,0.16)] sm:px-10"
        >
          <h2 className="font-display text-[2.35rem] font-bold leading-tight tracking-[-0.03em] text-white md:text-[3rem]">
            Ready to manage growth from one premium dashboard?
          </h2>
          <p className="mx-auto mt-4 max-w-[620px] text-[16px] leading-8 text-[#CBD5E1]">
            Create your account, fund your wallet, choose a service, and keep every order visible from start to finish.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register" className="btn-primary h-12 px-8 text-[15px]">
              Get Started
              <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              href="/services"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-white/20 bg-white/10 px-8 text-[15px] font-semibold text-white transition-colors hover:bg-white/15"
            >
              View Services
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
