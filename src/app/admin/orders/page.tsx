import type { Metadata } from "next";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminTable } from "@/features/admin/components/admin-table";

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
      <AdminPageHeader title="Orders" description={`${orders.length} most recent orders across the platform.`} />
      <AdminTable headers={["ID", "User", "Service", "Qty", "Charge", "Status", "Date"]}>
        {orders.map((o) => {
          const user = o.userId as unknown as { name: string; email: string } | null;
          const service = o.serviceId as unknown as { name: string } | null;
          return (
            <tr key={o._id.toString()} className="transition-colors hover:bg-ice/60">
              <td className="px-5 py-3 font-mono text-xs font-semibold text-brand-600">#{o._id.toString().slice(-8).toUpperCase()}</td>
              <td className="px-5 py-3">
                <p className="max-w-[120px] truncate font-medium text-ink">{user?.name}</p>
                <p className="max-w-[120px] truncate text-xs text-slate-400">{user?.email}</p>
              </td>
              <td className="max-w-[160px] truncate px-5 py-3 text-slate-600">{service?.name ?? "—"}</td>
              <td className="px-5 py-3 tabular-nums text-slate-600">{o.quantity.toLocaleString()}</td>
              <td className="px-5 py-3 font-medium tabular-nums text-ink">{formatCurrency(o.charge)}</td>
              <td className="px-5 py-3">
                <Badge variant={statusVariant[o.status] ?? "outline"} className="capitalize">{o.status}</Badge>
              </td>
              <td className="whitespace-nowrap px-5 py-3 text-slate-500">{formatDateTime(o.createdAt as unknown as string)}</td>
            </tr>
          );
        })}
      </AdminTable>
    </div>
  );
}
