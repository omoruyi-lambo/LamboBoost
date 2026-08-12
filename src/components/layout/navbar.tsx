"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.includes("#")) return false;
    return pathname.startsWith(href);
  };

  const solid = scrolled || isOpen || pathname !== "/";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-200",
        solid
          ? "border-b border-[#E2E8F0] bg-white/95 shadow-[0_1px_2px_rgba(2,6,23,0.04)] backdrop-blur-sm"
          : "border-b border-white/10 bg-[#0B1220]/80 backdrop-blur-md"
      )}
    >
      <div className="site-container flex h-16 items-center justify-between md:h-[72px]">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="LamboBoost home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="LamboBoost logo" className="h-8 w-auto" />
          <span
            className={cn(
              "font-display text-[16px] font-bold tracking-normal transition-colors",
              solid ? "text-[#0F172A]" : "text-white"
            )}
          >
            LamboBoost
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden md:block">
          <ul className="flex items-center gap-1" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3.5 py-2 text-[13.5px] font-medium transition-colors",
                    solid
                      ? isActive(link.href)
                        ? "bg-[#EFF6FF] text-[#2563EB]"
                        : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  )}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {session ? (
            <Link href="/dashboard" className="btn-primary h-10 px-5 text-[13px]">
              Dashboard
              <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" aria-hidden="true" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  "inline-flex h-10 items-center rounded-lg px-4 text-[13px] font-semibold transition-colors",
                  solid ? "text-[#334155] hover:bg-[#F8FAFC]" : "text-white/90 hover:bg-white/10 hover:text-white"
                )}
              >
                Login
              </Link>
              <Link href="/register" className="btn-primary h-10 px-5 text-[13px]">
                Get Started
                <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" aria-hidden="true" />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors md:hidden",
            solid
              ? "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              : "text-white/90 hover:bg-white/10 hover:text-white"
          )}
          onClick={() => setIsOpen((value) => !value)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          <FontAwesomeIcon icon={isOpen ? faXmark : faBars} className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="border-b border-[#E2E8F0] bg-white md:hidden"
          >
            <nav className="site-container py-4" aria-label="Mobile navigation">
              <ul className="space-y-1" role="list">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors",
                        isActive(link.href)
                          ? "bg-[#EFF6FF] text-[#2563EB]"
                          : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                      )}
                      aria-current={isActive(link.href) ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-col gap-2 border-t border-[#E2E8F0] pt-4">
                {session ? (
                  <Link href="/dashboard" className="btn-primary h-11 w-full">
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="btn-outline h-11 w-full">
                      Login
                    </Link>
                    <Link href="/register" className="btn-primary h-11 w-full">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
