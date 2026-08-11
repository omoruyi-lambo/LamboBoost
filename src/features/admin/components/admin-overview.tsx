import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faChartLine, faDollarSign, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

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
    { title: "Total Users", value: stats.totalUsers.toLocaleString(), icon: faUsers, color: "text-blue-500" },
    { title: "Total Orders", value: stats.totalOrders.toLocaleString(), icon: faCartShopping, color: "text-blue-600" },
    { title: "Total Revenue", value: formatCurrency(stats.totalRevenue), icon: faDollarSign, color: "text-emerald-500" },
    { title: "Active Orders", value: activeOrders.toLocaleString(), icon: faChartLine, color: "text-slate-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Platform summary at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ title, value, icon, color }) => (
          <Card key={title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground font-medium">{title}</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
                  <FontAwesomeIcon icon={icon} className={`h-5 w-5 ${color}`} />
                </div>
              </div>
              <p className="font-display text-2xl font-bold text-navy-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link href="/admin/orders" className="text-xs text-primary hover:underline">View all</Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Order", "User", "Service", "Qty", "Charge", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-3 font-mono text-xs text-primary">#{(o._id as string).slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-3">
                      <p className="font-medium truncate max-w-[120px]">{o.userId?.name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[120px]">{o.userId?.email}</p>
                    </td>
                    <td className="px-6 py-3 truncate max-w-[160px]">{o.serviceId?.name ?? "—"}</td>
                    <td className="px-6 py-3">{o.quantity.toLocaleString()}</td>
                    <td className="px-6 py-3 font-medium">{formatCurrency(o.charge)}</td>
                    <td className="px-6 py-3">
                      <Badge variant={statusVariant[o.status] ?? "outline"} className="capitalize">{o.status}</Badge>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground whitespace-nowrap">{formatRelativeTime(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
