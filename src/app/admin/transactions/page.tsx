import type { Metadata } from "next";
import { connectDB } from "@/lib/db/mongoose";
import { Transaction } from "@/lib/db/models";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminTable } from "@/features/admin/components/admin-table";

export const metadata: Metadata = { title: "Admin — Transactions" };

export default async function AdminTransactionsPage() {
  await connectDB();
  const transactions = await Transaction.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .populate("userId", "name email")
    .lean();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Transactions" description={`${transactions.length} most recent transactions across the platform.`} />
      <AdminTable headers={["User", "Type", "Amount", "Gateway", "Status", "Reference", "Date"]}>
        {transactions.map((tx) => {
          const user = tx.userId as unknown as { name: string; email: string } | null;
          return (
            <tr key={tx._id.toString()} className="transition-colors hover:bg-ice/60">
              <td className="px-5 py-4">
                <p className="max-w-[120px] truncate font-medium text-ink">{user?.name ?? "—"}</p>
                <p className="max-w-[120px] truncate text-xs text-slate-400">{user?.email}</p>
              </td>
              <td className="px-5 py-4 capitalize text-slate-500">{tx.type.replace("_", " ")}</td>
              <td className="px-5 py-4 font-semibold tabular-nums text-ink">{formatCurrency(tx.amount)}</td>
              <td className="px-5 py-4 capitalize text-slate-500">{tx.gateway ?? "—"}</td>
              <td className="px-5 py-4">
                <Badge variant={tx.status === "completed" ? "success" : tx.status === "failed" ? "destructive" : "secondary"} className="capitalize">
                  {tx.status}
                </Badge>
              </td>
              <td className="px-5 py-4 font-mono text-xs text-slate-500">{tx.reference}</td>
              <td className="whitespace-nowrap px-5 py-4 text-slate-500">{formatDateTime(tx.createdAt as unknown as string)}</td>
            </tr>
          );
        })}
      </AdminTable>
    </div>
  );
}
