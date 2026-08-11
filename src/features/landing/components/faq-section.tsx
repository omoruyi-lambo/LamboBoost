"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const faqs = [
  {
    question: "How do I create an account?",
    answer:
      "Click Get Started, enter your details, and sign in to access your dashboard. From there you can fund your wallet and place orders.",
  },
  {
    question: "How does LamboBoost work?",
    answer:
      "LamboBoost lets you browse digital marketing services, fund your wallet, place an order, and track the order from your dashboard.",
  },
  {
    question: "How do I fund my wallet?",
    answer:
      "Open the Wallet area in your dashboard, choose a deposit amount, and complete the supported payment flow. Your wallet updates after payment confirmation.",
  },
  {
    question: "How do I place an order?",
    answer:
      "Choose a service, enter the required details, review the cost, and submit the order using your wallet balance.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Every order appears in your Orders section with a status, progress bar, and reference so you can revisit it at any time.",
  },
  {
    question: "Can I cancel an order?",
    answer:
      "Cancellation depends on whether the order has started processing. If you need help, open a support ticket with the order ID.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Use the Support section in your dashboard to create a ticket and keep the conversation tied to your account.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="section-py bg-white">
      <div className="site-container">
        <div className="section-header">
          <span className="section-label">FAQ</span>
          <h2 className="section-heading">Questions before you get started?</h2>
          <p className="section-subheading">
            Clear answers about account setup, wallet funding, ordering, tracking, and support.
          </p>
        </div>

        <div className="mx-auto max-w-[780px] overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-[#F8FAFC] shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="border-b border-[#E2E8F0] last:border-0 px-5">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 rounded-[24px] py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
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
                {isOpen && <p className="pb-5 pr-8 text-[14px] leading-7 text-[#64748B]">{faq.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
