import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightArrowLeft,
  faArrowUpRightFromSquare,
  faBell,
  faBoxOpen,
  faCartShopping,
  faCircleCheck,
  faCircleQuestion,
  faGaugeHigh,
  faGear,
  faMagnifyingGlass,
  faPlus,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";

const sidebarItems = [
  { icon: faGaugeHigh, label: "Overview", active: true },
  { icon: faWallet, label: "Wallet", active: false },
  { icon: faCartShopping, label: "Orders", active: false },
  { icon: faBoxOpen, label: "Services", active: false },
  { icon: faArrowRightArrowLeft, label: "Transactions", active: false },
  { icon: faCircleQuestion, label: "Support", active: false },
  { icon: faGear, label: "Settings", active: false },
];

const statCards = [
  { label: "Wallet Balance", value: "₦ 48,200", icon: faWallet },
  { label: "Total Orders", value: "44", icon: faCartShopping },
  { label: "Pending Orders", value: "1", icon: faBoxOpen },
  { label: "Completed Orders", value: "41", icon: faCircleCheck },
];

const recentOrders = [
  { id: "ORD-1042", service: "Instagram Followers", qty: "5,000", platform: "IG", status: "Completed", progress: 100 },
  { id: "ORD-1043", service: "TikTok Video Views", qty: "25,000", platform: "TT", status: "Processing", progress: 62 },
  { id: "ORD-1044", service: "YouTube Watch Time", qty: "1,000", platform: "YT", status: "Pending", progress: 0 },
] as const;

const statusStyle: Record<string, { bg: string; text: string; bar: string }> = {
  Completed: { bg: "#EFF6FF", text: "#2563EB", bar: "#2563EB" },
  Processing: { bg: "#F0F9FF", text: "#2563EB", bar: "#38BDF8" },
  Pending: { bg: "#F1F5F9", text: "#64748B", bar: "#CBD5E1" },
};

const transactions = [
  { desc: "Wallet deposit", meta: "REF-88213 · 12 min ago", amount: "+₦ 20,000", positive: true },
  { desc: "Instagram Followers", meta: "ORD-1042 · 2 hrs ago", amount: "-₦ 1,250", positive: false },
  { desc: "Wallet deposit", meta: "REF-88194 · Yesterday", amount: "+₦ 35,000", positive: true },
  { desc: "TikTok Video Views", meta: "ORD-1043 · Yesterday", amount: "-₦ 500", positive: false },
];
const quickServices = [
  { platform: "Instagram", label: "Followers", tag: "View pricing" },
  { platform: "TikTok", label: "Video Views", tag: "View pricing" },
  { platform: "YouTube", label: "Watch Time", tag: "View pricing" },
  { platform: "Telegram", label: "Members", tag: "View pricing" },
];

const chartBars = [42, 68, 55, 80, 62, 75, 90, 58, 73, 85, 70, 95];

export function ProductMockup() {
  return (
    <div className="w-full overflow-hidden rounded-[32px] border border-[#E2E8F0] bg-white shadow-[0_26px_80px_rgba(15,23,42,0.12)]">
      <div className="flex h-11 items-center gap-2 border-b border-[#E2E8F0] bg-[#EFF6FF] px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-[#CBD5E1]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#CBD5E1]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#CBD5E1]" />
        <div className="ml-3 hidden flex-1 sm:flex">
          <div className="flex h-5 w-full max-w-[300px] items-center rounded-[10px] border border-[#E2E8F0] bg-white px-3 font-mono text-[11px] text-[#94A3B8]">
            app.lamboboost.com/dashboard
          </div>
        </div>
        <span className="ml-auto rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-2 py-1 text-[10px] font-semibold text-[#2563EB]">
          Demo data
        </span>
      </div>

      <div className="flex min-h-[560px] flex-col md:flex-row">
        <aside className="hidden w-[232px] shrink-0 flex-col border-r border-[#E2E8F0] bg-[#0F172A] md:flex">
          <div className="flex h-12 items-center border-b border-white/[0.08] px-5">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className="h-6 w-auto" />
              <span className="text-[13px] font-semibold tracking-normal text-white">LamboBoost</span>
            </div>
          </div>

          <div className="px-4 py-4">
            <div className="flex h-9 items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.08] px-3 text-[#CBD5E1]">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="h-3.5 w-3.5" />
              <span className="text-[11px]">Search</span>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-3 pt-2">
            {sidebarItems.map(({ icon, label, active }) => (
              <div
                key={label}
                className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium ${
                  active ? "bg-[#2563EB] text-white" : "text-[#94A3B8] hover:bg-white/5"
                }`}
              >
                <FontAwesomeIcon icon={icon} className="h-4 w-4 shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </nav>

          <div className="mx-4 mb-4 rounded-[24px] border border-white/[0.08] bg-white/[0.04] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB] text-[12px] font-bold text-white">
                A
              </div>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-white">Alex O.</p>
                <p className="truncate text-[11px] text-[#94A3B8]">alex@example.com</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#F8FAFC]">
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#E2E8F0] bg-white px-4 sm:px-5">
            <div className="min-w-0">
              <p className="text-[13.5px] font-semibold leading-tight text-[#0F172A]">Overview</p>
              <p className="hidden text-[10.5px] leading-tight text-[#94A3B8] sm:block">Welcome back, Alex</p>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="hidden h-8 items-center gap-2 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 lg:flex">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="h-3.5 w-3.5 text-[#94A3B8]" />
                <span className="text-[11px] text-[#94A3B8]">Search orders</span>
              </div>
              <div className="relative flex h-8 w-8 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white">
                <FontAwesomeIcon icon={faBell} className="h-4 w-4 text-[#64748B]" />
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
              </div>
              <div className="flex h-8 items-center gap-1.5 rounded-2xl bg-[#2563EB] px-3.5">
                <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5 text-white" />
                <span className="text-[11px] font-semibold text-white">New Order</span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {statCards.map(({ label, value, icon }) => (
                <div key={label} className="rounded-[20px] border border-[#E2E8F0] bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[11px] font-medium leading-none text-[#64748B]">{label}</span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-2xl bg-[#EFF6FF]">
                      <FontAwesomeIcon icon={icon} className="h-3.5 w-3.5 text-[#2563EB]" />
                    </div>
                  </div>
                  <p className="font-display text-[18px] font-bold leading-none tracking-normal text-[#0F172A]">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
              <div className="overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white lg:col-span-3">
                <div className="flex items-center justify-between border-b border-[#F1F5F9] px-4 py-3">
                  <span className="text-[12.5px] font-semibold text-[#0F172A]">Recent Orders</span>
                  <span className="text-[11.5px] font-medium text-[#2563EB]">View all</span>
                </div>
                <div className="divide-y divide-[#F8FAFC]">
                  {recentOrders.map((order) => {
                    const status = statusStyle[order.status];
                    return (
                      <div key={order.id} className="px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] text-[9.5px] font-bold text-[#64748B]">
                              {order.platform}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-[12px] font-medium text-[#0F172A]">{order.service}</p>
                              <p className="text-[10.5px] text-[#94A3B8]">
                                {order.id} / {order.qty} units
                              </p>
                            </div>
                          </div>
                          <span
                            className="shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-semibold"
                            style={{ background: status.bg, color: status.text }}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F1F5F9]">
                            <div className="h-full rounded-full" style={{ width: `${order.progress}%`, background: status.bar }} />
                          </div>
                          <span className="w-7 text-right text-[10px] tabular-nums text-[#94A3B8]">{order.progress}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col rounded-[28px] border border-[#E2E8F0] bg-white p-4 lg:col-span-2">
                <div className="mb-4">
                  <p className="text-[12.5px] font-semibold text-[#0F172A]">Order Activity</p>
                  <p className="mt-0.5 text-[10.5px] text-[#94A3B8]">Demo periods</p>
                </div>
                <div className="flex h-[96px] flex-1 items-end gap-1.5">
                  {chartBars.map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${height}%`,
                        background: index > chartBars.length - 3 ? "#2563EB" : "#E2E8F0",
                      }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[9.5px] text-[#94A3B8]">
                  <span>Jan 12</span>
                  <span>Feb 12</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
              <div className="overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white lg:col-span-2">
                <div className="flex items-center justify-between border-b border-[#F1F5F9] px-4 py-3">
                  <span className="text-[12.5px] font-semibold text-[#0F172A]">Recent Transactions</span>
                  <span className="text-[11.5px] font-medium text-[#2563EB]">View all</span>
                </div>
                <div className="divide-y divide-[#F8FAFC]">
                  {transactions.map((tx) => (
                    <div key={tx.desc + tx.amount} className="flex items-center justify-between px-4 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-medium text-[#0F172A]">{tx.desc}</p>
                        <p className="truncate text-[10.5px] text-[#94A3B8]">{tx.meta}</p>
                      </div>
                      <span className={`shrink-0 text-[12px] font-semibold tabular-nums ${tx.positive ? "text-[#2563EB]" : "text-[#64748B]"}`}>
                        {tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-4 lg:col-span-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[12.5px] font-semibold text-[#0F172A]">Top Services</span>
                  <span className="flex items-center gap-1 text-[11.5px] font-medium text-[#2563EB]">
                    Browse all
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-3 w-3" />
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {quickServices.map((service) => (
                    <div
                      key={service.platform + service.label}
                      className="rounded-[20px] border border-[#E2E8F0] bg-[#F8FAFC] p-3 transition-colors hover:border-[#BFDBFE] hover:bg-[#EFF6FF]"
                    >
                      <p className="text-[10px] font-semibold uppercase leading-none tracking-normal text-[#2563EB]">
                        {service.platform}
                      </p>
                      <p className="mt-1.5 text-[12.5px] font-semibold leading-tight text-[#0F172A]">{service.label}</p>
                      <p className="mt-1 text-[10.5px] text-[#64748B]">{service.tag}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
