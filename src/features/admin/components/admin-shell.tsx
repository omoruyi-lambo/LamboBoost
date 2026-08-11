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

const navItems = [
  { label: "Overview", href: "/admin", icon: faGaugeHigh },
  { label: "Orders", href: "/admin/orders", icon: faCartShopping },
  { label: "Users", href: "/admin/users", icon: faUsers },
  { label: "Wallet", href: "/admin/wallet", icon: faWallet },
  { label: "Transactions", href: "/admin/transactions", icon: faArrowRightArrowLeft },
  { label: "Services", href: "/admin/services", icon: faBoxOpen },
  { label: "Categories", href: "/admin/categories", icon: faLayerGroup },
  { label: "Coupons", href: "/admin/coupons", icon: faTag },
  { label: "Support", href: "/admin/support", icon: faCircleQuestion },
  { label: "Announcements", href: "/admin/announcements", icon: faBullhorn },
  { label: "Logs", href: "/admin/logs", icon: faFileLines },
  { label: "Settings", href: "/admin/settings", icon: faGear },
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
    <div className="flex h-full flex-col bg-navy-900">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <span className="text-[11px] font-bold text-white">L</span>
        </div>
        <span className="font-display font-bold text-white">Admin</span>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav>
          <ul className="space-y-0.5">
            {navItems.map(({ label, href, icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive(href) ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <FontAwesomeIcon icon={icon} className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback className="bg-primary/20 text-primary text-xs">{getInitials(user.name ?? "A")}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-white/50 truncate">{user.email}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="text-white/40 hover:text-white">
            <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <aside className="hidden lg:flex lg:w-60 lg:flex-col shrink-0">
        <Sidebar />
      </aside>
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-full w-60 lg:hidden">
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center border-b border-border bg-white px-4 shrink-0">
          <button className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted"
            onClick={() => setSidebarOpen(true)}>
            <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
          </button>
          <span className="ml-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Admin Panel
          </span>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-7xl py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
