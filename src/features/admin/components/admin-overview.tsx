import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faChartLine, faDollarSign, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { AdminPageHeader } from "./admin-page-header";
import { AdminTable } from "./admin-table";

interface Props {
  stats: {
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    orderStats: Array<{ _id: string; count: number }>;
  };
  recentOrders: Array<{
    _id: string;
    status: string;
    quantity: number;
    charge: number;
    createdAt: string;
    userId?: { name: string; email: string } | null;
    serviceId?: { name: string } | null;
  }>;
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
  completed: "success", processing: "default", pending: "warning",
  failed: "destructive", cancelled: "destructive", partial: "secondary", refunded: "outline",
};

export function AdminOverview({ stats, recentOrders }: Props) {
  const activeOrders = stats.orderStats
    .filter((s) => ["pending", "processing"].includes(s._id))
    .reduce((sum, s) => sum + s.count, 0);

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: faUsers,
      chip: "bg-[#E0F2FE] text-[#0369A1]",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: faCartShopping,
      chip: "bg-brand-50 text-brand-600",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: faDollarSign,
      chip: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Active Orders",
      value: activeOrders.toLocaleString(),
      icon: faChartLine,
      chip: "bg-violet-50 text-violet-600",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Overview"
        description="Platform summary at a glance."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ title, value, icon, chip }) => (
          <div key={title} className="rounded-2xl border border-line bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{title}</p>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${chip}`}>
                <FontAwesomeIcon icon={icon} className="h-4 w-4" />
              </div>
            </div>
            <p className="font-display text-2xl font-bold tracking-tight text-ink">{value}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-ink">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-[#0369A1] hover:underline">
            View all
          </Link>
        </div>
        <AdminTable headers={["Order", "User", "Service", "Qty", "Charge", "Status", "Date"]}>
          {recentOrders.map((o) => (
            <tr key={o._id} className="transition-colors hover:bg-mist">
              <td className="px-5 py-3 font-mono text-xs font-semibold text-brand-600">
                #{String(o._id).slice(-8).toUpperCase()}
              </td>
              <td className="px-5 py-3">
                <p className="max-w-[120px] truncate font-medium text-ink">{o.userId?.name ?? "—"}</p>
                <p className="max-w-[120px] truncate text-xs text-slate-400">{o.userId?.email}</p>
              </td>
              <td className="max-w-[160px] truncate px-5 py-3 text-slate-600">{o.serviceId?.name ?? "—"}</td>
              <td className="px-5 py-3 tabular-nums text-slate-600">{o.quantity.toLocaleString()}</td>
              <td className="px-5 py-3 font-medium tabular-nums text-ink">{formatCurrency(o.charge)}</td>
              <td className="px-5 py-3">
                <Badge variant={statusVariant[o.status] ?? "outline"} className="capitalize">{o.status}</Badge>
              </td>
              <td className="whitespace-nowrap px-5 py-3 text-slate-500">{formatRelativeTime(o.createdAt)}</td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </div>
  );
}
