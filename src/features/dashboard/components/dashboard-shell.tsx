"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  faArrowRightArrowLeft,
  faBell,
  faCartShopping,
  faCircleQuestion,
  faGaugeHigh,
  faGear,
  faRightFromBracket,
  faBars,
  faUser,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: faGaugeHigh },
  { label: "Orders", href: "/dashboard/orders", icon: faCartShopping },
  { label: "Wallet", href: "/dashboard/wallet", icon: faWallet },
  { label: "Transactions", href: "/dashboard/transactions", icon: faArrowRightArrowLeft },
  { label: "Notifications", href: "/dashboard/notifications", icon: faBell },
  { label: "Support", href: "/dashboard/support", icon: faCircleQuestion },
];

const bottomItems = [
  { label: "Profile", href: "/dashboard/profile", icon: faUser },
  { label: "Settings", href: "/dashboard/settings", icon: faGear },
];

interface DashboardShellProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-line px-6">
        <Link href="/" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="LamboBoost logo" className="h-7 w-auto" />
          <span className="font-display font-bold tracking-normal text-ink">LamboBoost</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-5">
        <p className="mb-2 px-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Menu
        </p>
        {/* Main nav */}
        <nav aria-label="Main navigation">
          <ul className="space-y-1" role="list">
            {navItems.map(({ label, href, icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(href)
                      ? "bg-brand-50 text-brand-600"
                      : "text-slate-500 hover:bg-mist hover:text-ink"
                  )}
                  aria-current={isActive(href) ? "page" : undefined}
                >
                  <FontAwesomeIcon icon={icon} className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom nav */}
        <div className="mt-6 border-t border-line pt-4">
          <ul className="space-y-1" role="list">
            {bottomItems.map(({ label, href, icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(href)
                      ? "bg-brand-50 text-brand-600"
                      : "text-slate-500 hover:bg-mist hover:text-ink"
                  )}
                  aria-current={isActive(href) ? "page" : undefined}
                >
                  <FontAwesomeIcon icon={icon} className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </ScrollArea>

      {/* Help card */}
      <div className="mx-4 mb-4 rounded-2xl border border-line bg-ice p-4">
        <p className="text-[13px] font-semibold text-ink">Need a hand?</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Our support team is here to help with orders and payments.
        </p>
        <Link
          href="/dashboard/support"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          Contact support
          <FontAwesomeIcon icon={faCircleQuestion} className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>

      {/* User section */}
      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
            <AvatarFallback className="bg-brand-50 text-brand-600 text-xs font-semibold">
              {getInitials(user.name ?? "U")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{user.name}</p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-slate-400 transition-colors hover:text-ink"
            aria-label="Sign out"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-mist">
      {/* Desktop sidebar */}
      <aside
        className="hidden w-64 shrink-0 border-r border-line lg:flex lg:flex-col"
        aria-label="Sidebar"
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-full w-64 lg:hidden"
              aria-label="Mobile sidebar"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-white px-4 md:px-6">
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-mist hover:text-ink lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/dashboard/notifications"
              className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-mist hover:text-ink"
              aria-label="Notifications"
            >
              <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
            </Link>
            <Link href="/dashboard/profile">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
                <AvatarFallback className="bg-brand-50 text-brand-600 text-xs font-semibold">
                  {getInitials(user.name ?? "U")}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-7xl py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
