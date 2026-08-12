import type { Metadata } from "next";
import { connectDB } from "@/lib/db/mongoose";
import { Wallet } from "@/lib/db/models";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminTable } from "@/features/admin/components/admin-table";

export const metadata: Metadata = { title: "Admin — Wallets" };

export default async function AdminWalletPage() {
  await connectDB();
  const wallets = await Wallet.find()
    .sort({ balance: -1 })
    .limit(100)
    .populate("userId", "name email")
    .lean();

  const totalBalance = wallets.reduce((s, w) => s + w.balance, 0);
  const totalDeposited = wallets.reduce((s, w) => s + w.totalDeposited, 0);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Wallets" description={`${wallets.length} customer wallets on the platform.`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Balances", value: formatCurrency(totalBalance) },
          { label: "Total Deposited (all time)", value: formatCurrency(totalDeposited) },
          { label: "Active Wallets", value: wallets.filter((w) => !w.isLocked).length.toString() },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-line bg-white p-5 shadow-card">
            <p className="mb-2 text-sm text-slate-500">{label}</p>
            <p className="font-display text-2xl font-bold tracking-tight text-ink">{value}</p>
          </div>
        ))}
      </div>

      <AdminTable headers={["User", "Balance", "Deposited", "Spent", "Status"]}>
        {wallets.map((w) => {
          const user = w.userId as unknown as { name: string; email: string } | null;
          return (
            <tr key={w._id.toString()} className="transition-colors hover:bg-ice/60">
              <td className="px-5 py-4">
                <p className="font-medium text-ink">{user?.name ?? "—"}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </td>
              <td className="px-5 py-4 font-semibold tabular-nums text-ink">{formatCurrency(w.balance)}</td>
              <td className="px-5 py-4 tabular-nums text-emerald-600">{formatCurrency(w.totalDeposited)}</td>
              <td className="px-5 py-4 tabular-nums text-slate-500">{formatCurrency(w.totalSpent)}</td>
              <td className="px-5 py-4">
                <Badge variant={w.isLocked ? "destructive" : "success"}>
                  {w.isLocked ? "Locked" : "Active"}
                </Badge>
              </td>
            </tr>
          );
        })}
      </AdminTable>
    </div>
  );
}
