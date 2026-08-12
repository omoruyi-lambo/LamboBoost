"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  faArrowRightArrowLeft,
  faBoxOpen,
  faBullhorn,
  faCartShopping,
  faCircleQuestion,
  faFileLines,
  faGaugeHigh,
  faGear,
  faLayerGroup,
  faRightFromBracket,
  faShieldHalved,
  faTag,
  faUsers,
  faWallet,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const navGroups = [
  {
    label: "Operations",
    items: [
      { label: "Overview", href: "/admin", icon: faGaugeHigh },
      { label: "Orders", href: "/admin/orders", icon: faCartShopping },
      { label: "Transactions", href: "/admin/transactions", icon: faArrowRightArrowLeft },
      { label: "Wallet", href: "/admin/wallet", icon: faWallet },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Users", href: "/admin/users", icon: faUsers },
      { label: "Services", href: "/admin/services", icon: faBoxOpen },
      { label: "Categories", href: "/admin/categories", icon: faLayerGroup },
      { label: "Coupons", href: "/admin/coupons", icon: faTag },
      { label: "Announcements", href: "/admin/announcements", icon: faBullhorn },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Support", href: "/admin/support", icon: faCircleQuestion },
      { label: "Logs", href: "/admin/logs", icon: faFileLines },
      { label: "Settings", href: "/admin/settings", icon: faGear },
    ],
  },
];

interface AdminShellProps {
  user: { name?: string | null; email?: string | null; image?: string | null };
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  const Sidebar = () => (
    <div className="flex h-full flex-col bg-midnight-900">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-white/[0.08] px-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="LamboBoost logo" className="h-7 w-auto" />
        <div className="min-w-0">
          <p className="font-display text-[14px] font-bold leading-tight tracking-normal text-white">
            LamboBoost
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-sky-400/15 px-1.5 py-px text-[9.5px] font-bold uppercase tracking-[0.14em] text-sky-400">
            <FontAwesomeIcon icon={faShieldHalved} className="h-2 w-2" aria-hidden="true" />
            Admin
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav aria-label="Admin navigation">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                {group.label}
              </p>
              <ul className="space-y-0.5" role="list">
                {group.items.map(({ label, href, icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-medium transition-colors",
                        isActive(href)
                          ? "bg-sky-400/15 text-sky-300"
                          : "text-white/55 hover:bg-white/[0.06] hover:text-white"
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
          ))}
        </nav>
      </ScrollArea>

      {/* User section */}
      <div className="border-t border-white/[0.08] p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? "Admin"} />
            <AvatarFallback className="bg-sky-400/20 text-sky-300 text-xs font-semibold">
              {getInitials(user.name ?? "A")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="truncate text-xs text-white/45">{user.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-white/40 transition-colors hover:text-white"
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
      <aside className="hidden w-64 shrink-0 lg:flex lg:flex-col" aria-label="Sidebar">
        <Sidebar />
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
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-line bg-white px-4 md:px-6">
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-mist hover:text-ink lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
          </button>
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0369A1]">
            <FontAwesomeIcon icon={faShieldHalved} className="h-3.5 w-3.5" aria-hidden="true" />
            Admin Panel
          </span>
          <span className="ml-auto hidden rounded-full bg-[#E0F2FE] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#0369A1] sm:inline-block">
            Platform management
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-7xl py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
