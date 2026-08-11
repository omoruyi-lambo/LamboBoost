"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { BrandIcon } from "@/components/icons/brand-icon";

const services = [
  {
    title: "Instagram Followers",
    description: "Follower-growth services for Instagram campaigns and creator accounts.",
    icon: "instagram",
    href: "/services?platform=instagram",
  },
  {
    title: "TikTok Likes",
    description: "Engagement services designed for TikTok videos and trends.",
    icon: "tiktok",
    href: "/services?platform=tiktok",
  },
  {
    title: "YouTube Views",
    description: "View-boosting services to support channel visibility and watch time.",
    icon: "youtube",
    href: "/services?platform=youtube",
  },
  {
    title: "Facebook Page Likes",
    description: "Page engagement services for brands, communities, and campaigns.",
    icon: "facebook",
    href: "/services?platform=facebook",
  },
  {
    title: "Telegram Members",
    description: "Member-growth services for Telegram groups and broadcast channels.",
    icon: "telegram",
    href: "/services?platform=telegram",
  },
  {
    title: "Other Digital Services",
    description: "Additional social services and marketing tools as they expand.",
    icon: "other",
    href: "/services",
  },
];

export function ServicesPreviewSection() {
  return (
    <section id="services" className="section-py bg-white">
      <div className="site-container">
        <div className="section-header">
          <span className="section-label">Services</span>
          <h2 className="section-heading">Choose the service that fits your growth plan.</h2>
          <p className="section-subheading">
            Browse platform-specific service categories and move directly to pricing with confidence.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.05, duration: 0.36, ease: "easeOut" }}
              className="rounded-[28px] border border-[#E2E8F0] bg-[#F8FAFC] p-6 shadow-[0_16px_32px_rgba(15,23,42,0.06)]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-3xl border border-[#D9E6FF] bg-white text-[#2563EB]">
                {service.icon === "other" ? (
                  <FontAwesomeIcon icon={faBoxOpen} className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <BrandIcon name={service.icon} className="h-5 w-5" />
                )}
              </div>
              <h3 className="text-[18px] font-semibold tracking-normal text-[#0F172A]">{service.title}</h3>
              <p className="mt-3 text-[14px] leading-7 text-[#64748B]">{service.description}</p>
              <Link
                href={service.href}
                className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
              >
                View pricing
                <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" aria-hidden="true" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
