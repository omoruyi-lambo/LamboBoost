"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { BrandIcon } from "@/components/icons/brand-icon";
import { SERVICE_CATEGORIES } from "@/lib/constants";

export function ServicesPreviewSection() {
  return (
    <section id="services" className="section-py bg-white">
      <div className="site-container">
        <div className="section-header">
          <span className="section-label">Services</span>
          <h2 className="section-heading">A marketplace for the platforms you grow.</h2>
          <p className="section-subheading">
            Browse services by platform. Every order is priced by the quantity you choose — no
            subscriptions required.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.map((category, index) => (
            <motion.article
              key={category.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.05, duration: 0.36, ease: "easeOut" }}
              className="flex flex-col rounded-2xl border border-[#E2E8F0] bg-white p-6 transition-shadow hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-center justify-between">
                <BrandIcon name={category.slug} className="h-6 w-6 text-[#2563EB]" />
                <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">
                  {category.platform}
                </span>
              </div>

              <h3 className="mt-5 text-[17px] font-semibold tracking-normal text-[#0F172A]">
                {category.platform}
              </h3>
              <p className="mt-2 text-[14px] leading-7 text-[#64748B]">{category.description}</p>

              <ul className="mt-4 space-y-1.5" role="list">
                {category.services.map((service) => (
                  <li key={service.name} className="flex items-center gap-2 text-[13px] text-[#475569]">
                    <span className="h-1 w-1 rounded-full bg-[#2563EB]" aria-hidden="true" />
                    {service.name}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-center justify-between border-t border-[#E2E8F0] pt-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#94A3B8]">
                    Starting price
                  </p>
                  <p className="mt-0.5 text-[13.5px] font-semibold text-[#0F172A]">Priced per unit</p>
                </div>
                <Link
                  href={`/services?platform=${category.slug}`}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
                >
                  View Service
                  <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
