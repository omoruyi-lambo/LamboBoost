import type { Metadata } from "next";
import { connectDB } from "@/lib/db/mongoose";
import { Wallet, User } from "@/lib/db/models";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

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
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900">Wallets</h1>
        <p className="text-sm text-muted-foreground mt-1">{wallets.length} wallets</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Balances", value: formatCurrency(totalBalance) },
          { label: "Total Deposited (all time)", value: formatCurrency(totalDeposited) },
          { label: "Active Wallets", value: wallets.filter((w) => !w.isLocked).length.toString() },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">{label}</p>
              <p className="font-display text-2xl font-bold text-navy-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["User", "Balance", "Deposited", "Spent", "Status"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {wallets.map((w) => {
                  const user = w.userId as { name: string; email: string } | null;
                  return (
                    <tr key={w._id.toString()} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <p className="font-medium">{user?.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-navy-900">{formatCurrency(w.balance)}</td>
                      <td className="px-6 py-4 text-emerald-600">{formatCurrency(w.totalDeposited)}</td>
                      <td className="px-6 py-4 text-muted-foreground">{formatCurrency(w.totalSpent)}</td>
                      <td className="px-6 py-4">
                        <Badge variant={w.isLocked ? "destructive" : "success"}>
                          {w.isLocked ? "Locked" : "Active"}
                        </Badge>
                      </td>
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
