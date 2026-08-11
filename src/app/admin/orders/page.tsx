import type { Metadata } from "next";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin — Orders" };

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
  completed: "success", processing: "default", pending: "warning",
  failed: "destructive", cancelled: "destructive", partial: "secondary", refunded: "outline",
};

export default async function AdminOrdersPage() {
  await connectDB();
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("userId", "name email")
    .populate("serviceId", "name")
    .lean();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-navy-900">Orders</h1>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["ID", "User", "Service", "Qty", "Charge", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((o) => {
                  const user = o.userId as { name: string; email: string } | null;
                  const service = o.serviceId as { name: string } | null;
                  return (
                    <tr key={o._id.toString()} className="hover:bg-muted/30">
                      <td className="px-6 py-3 font-mono text-xs text-primary">#{o._id.toString().slice(-8).toUpperCase()}</td>
                      <td className="px-6 py-3">
                        <p className="font-medium truncate max-w-[120px]">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </td>
                      <td className="px-6 py-3 truncate max-w-[160px]">{service?.name ?? "—"}</td>
                      <td className="px-6 py-3">{o.quantity.toLocaleString()}</td>
                      <td className="px-6 py-3 font-medium">{formatCurrency(o.charge)}</td>
                      <td className="px-6 py-3">
                        <Badge variant={statusVariant[o.status] ?? "outline"} className="capitalize">{o.status}</Badge>
                      </td>
                      <td className="px-6 py-3 text-muted-foreground whitespace-nowrap">{formatDateTime(o.createdAt as unknown as string)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
