"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface Order {
  _id: string;
  status: string;
  quantity: number;
  charge: number;
  link: string;
  createdAt: string;
  serviceId?: { name: string; pricePerUnit: number } | null;
}

const STATUS_OPTIONS = ["all", "pending", "processing", "completed", "failed", "cancelled", "partial", "refunded"];

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
  completed: "success",
  processing: "default",
  pending: "warning",
  failed: "destructive",
  cancelled: "destructive",
  partial: "secondary",
  refunded: "outline",
};

export function OrdersPage({ orders }: { orders: Order[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.serviceId?.name.toLowerCase().includes(search.toLowerCase()) ||
      o.link.toLowerCase().includes(search.toLowerCase()) ||
      o._id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {orders.length} total order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/services">
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
            New order
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by service, link or order ID..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s === "all" ? "All statuses" : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground mb-4">
              {orders.length === 0 ? "No orders yet." : "No orders match your filters."}
            </p>
            {orders.length === 0 && (
              <Button asChild>
                <Link href="/services">Browse services</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Order", "Service", "Quantity", "Charge", "Status", "Date"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider first:pl-6 last:pr-6">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((order) => (
                    <tr key={order._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/orders/${order._id}`} className="font-mono text-xs text-primary hover:underline">
                          #{order._id.slice(-8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground max-w-[180px] truncate">
                          {order.serviceId?.name ?? "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[180px] mt-0.5">
                          {order.link}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {order.quantity.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        {formatCurrency(order.charge)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusVariant[order.status] ?? "outline"} className="capitalize">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {formatDateTime(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
