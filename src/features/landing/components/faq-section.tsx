"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FAQS } from "@/lib/constants";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="section-py bg-[#F8FAFC]">
      <div className="site-container">
        <div className="section-header">
          <span className="section-label">FAQ</span>
          <h2 className="section-heading">Questions before you get started?</h2>
          <p className="section-subheading">
            Clear answers about account setup, wallet funding, ordering, tracking, and support.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto max-w-[780px] overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white"
        >
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="border-b border-[#E2E8F0] last:border-0">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-semibold text-[#0F172A]">{faq.question}</span>
                  <FontAwesomeIcon
                    icon={isOpen ? faMinus : faPlus}
                    className="h-3.5 w-3.5 shrink-0 text-[#2563EB]"
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <p className="px-6 pb-5 text-[14px] leading-7 text-[#64748B]">{faq.answer}</p>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
