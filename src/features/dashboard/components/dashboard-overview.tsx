"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCartShopping,
  faChartLine,
  faCircleCheck,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatRelativeTime, truncate } from "@/lib/utils";

interface Props {
  data: {
    balance: number;
    totalDeposited: number;
    totalSpent: number;
    recentOrders: Array<{
      _id: string;
      status: string;
      quantity: number;
      charge: number;
      link: string;
      createdAt: string;
      serviceId?: { name: string } | null;
    }>;
    recentTransactions: Array<{
      _id: string;
      type: string;
      amount: number;
      status: string;
      description: string;
      createdAt: string;
    }>;
    orderStats: Array<{ _id: string; count: number }>;
  };
  user: { name?: string | null };
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
  completed: "success",
  processing: "default",
  pending: "warning",
  failed: "destructive",
  cancelled: "destructive",
  partial: "secondary",
  refunded: "outline",
};

export function DashboardOverview({ data, user }: Props) {
  const completedCount = data.orderStats.find((s) => s._id === "completed")?.count ?? 0;
  const activeCount = data.orderStats
    .filter((s) => ["pending", "processing"].includes(s._id))
    .reduce((sum, s) => sum + s.count, 0);
  const totalOrders = data.orderStats.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900">
          Good {getGreeting()}, {(user.name ?? "there").split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here's what's happening with your account.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Wallet Balance"
          value={formatCurrency(data.balance)}
          icon={<FontAwesomeIcon icon={faWallet} className="h-4 w-4 text-primary" />}
          action={{ label: "Add funds", href: "/dashboard/wallet" }}
          highlight
        />
        <StatCard
          title="Active Orders"
          value={String(activeCount)}
          icon={<FontAwesomeIcon icon={faCartShopping} className="h-4 w-4 text-blue-500" />}
          action={{ label: "View orders", href: "/dashboard/orders" }}
        />
        <StatCard
          title="Completed"
          value={String(completedCount)}
          icon={<FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4 text-emerald-500" />}
          action={{ label: "View all", href: "/dashboard/orders" }}
        />
        <StatCard
          title="Total Spent"
          value={formatCurrency(data.totalSpent)}
          icon={<FontAwesomeIcon icon={faChartLine} className="h-4 w-4 text-blue-600" />}
          action={{ label: "Transactions", href: "/dashboard/transactions" }}
        />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/services">New order</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/wallet">Fund wallet</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/support">Open ticket</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base">Recent Orders</CardTitle>
            <Link href="/dashboard/orders" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {data.recentOrders.length === 0 ? (
              <div className="px-6 pb-6 text-center text-sm text-muted-foreground py-8">
                No orders yet.{" "}
                <Link href="/services" className="text-primary hover:underline">Browse services</Link>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {data.recentOrders.map((order) => (
                  <li key={order._id} className="flex items-center justify-between px-6 py-3 hover:bg-muted/40 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                        {order.serviceId?.name ?? "Unknown service"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {order.quantity.toLocaleString()} units · {formatRelativeTime(order.createdAt)}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-col items-end gap-1 shrink-0">
                      <Badge variant={statusVariant[order.status] ?? "outline"} className="capitalize text-xs">
                        {order.status}
                      </Badge>
                      <span className="text-xs font-medium text-foreground">{formatCurrency(order.charge)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base">Recent Transactions</CardTitle>
            <Link href="/dashboard/transactions" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {data.recentTransactions.length === 0 ? (
              <div className="px-6 pb-6 text-center text-sm text-muted-foreground py-8">
                No transactions yet.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {data.recentTransactions.map((tx) => (
                  <li key={tx._id} className="flex items-center justify-between px-6 py-3 hover:bg-muted/40 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate max-w-[220px]">
                        {truncate(tx.description, 40)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatRelativeTime(tx.createdAt)}
                      </p>
                    </div>
                    <span className={`ml-4 text-sm font-semibold shrink-0 ${
                      tx.type === "deposit" || tx.type === "refund" || tx.type === "bonus"
                        ? "text-emerald-600"
                        : "text-foreground"
                    }`}>
                      {tx.type === "deposit" || tx.type === "refund" || tx.type === "bonus" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title, value, icon, action, highlight,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  action: { label: string; href: string };
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-blue-200 bg-blue-50/40" : ""}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-border shadow-card">
            {icon}
          </div>
        </div>
        <p className="font-display text-2xl font-bold text-navy-900">{value}</p>
        <Link href={action.href} className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline">
          {action.label} <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
