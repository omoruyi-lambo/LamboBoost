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
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <span className="text-[11px] font-bold text-white">L</span>
          </div>
          <span className="font-display font-bold text-white">LamboBoost</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        {/* Main nav */}
        <nav aria-label="Main navigation">
          <ul className="space-y-0.5" role="list">
            {navItems.map(({ label, href, icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(href)
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
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
        <div className="mt-6 border-t border-white/10 pt-4">
          <ul className="space-y-0.5" role="list">
            {bottomItems.map(({ label, href, icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(href)
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <FontAwesomeIcon icon={icon} className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </ScrollArea>

      {/* User section */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
              {getInitials(user.name ?? "U")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-white/50 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-white/40 hover:text-white transition-colors"
            aria-label="Sign out"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex lg:w-64 lg:flex-col bg-navy-900 shrink-0"
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
              className="fixed left-0 top-0 z-50 h-full w-64 bg-navy-900 lg:hidden"
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
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-4 md:px-6 shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <Link
              href="/dashboard/notifications"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative"
              aria-label="Notifications"
            >
              <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
            </Link>
            <Link href="/dashboard/profile">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
                <AvatarFallback className="bg-blue-50 text-blue-700 text-xs font-semibold">
                  {getInitials(user.name ?? "U")}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-7xl py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
