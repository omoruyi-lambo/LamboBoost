import type { Metadata } from "next";
import { connectDB } from "@/lib/db/mongoose";
import { Transaction } from "@/lib/db/models";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";

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
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900">Transactions</h1>
        <p className="text-sm text-muted-foreground mt-1">{transactions.length} recent transactions</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["User", "Type", "Amount", "Gateway", "Status", "Reference", "Date"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((tx) => {
                  const user = tx.userId as { name: string; email: string } | null;
                  return (
                    <tr key={tx._id.toString()} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <p className="font-medium truncate max-w-[120px]">{user?.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">{user?.email}</p>
                      </td>
                      <td className="px-6 py-4 capitalize text-muted-foreground">{tx.type.replace("_", " ")}</td>
                      <td className="px-6 py-4 font-semibold">{formatCurrency(tx.amount)}</td>
                      <td className="px-6 py-4 capitalize text-muted-foreground">{tx.gateway ?? "—"}</td>
                      <td className="px-6 py-4">
                        <Badge variant={tx.status === "completed" ? "success" : tx.status === "failed" ? "destructive" : "secondary"} className="capitalize">
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{tx.reference}</td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{formatDateTime(tx.createdAt as unknown as string)}</td>
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
