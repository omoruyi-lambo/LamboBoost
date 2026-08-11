import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Transaction } from "@/lib/db/models";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Transactions" };

const txSign: Record<string, string> = {
  deposit: "+", refund: "+", bonus: "+",
  withdrawal: "-", order_payment: "-", adjustment: "±",
};
const txColor: Record<string, string> = {
  deposit: "text-emerald-600", refund: "text-emerald-600", bonus: "text-emerald-600",
  withdrawal: "text-destructive", order_payment: "text-foreground", adjustment: "text-foreground",
};

export default async function TransactionsPage() {
  const session = await auth();
  await connectDB();

  const transactions = await Transaction.find({ userId: session!.user.id })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  const txs = JSON.parse(JSON.stringify(transactions));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900">Transactions</h1>
        <p className="mt-1 text-sm text-muted-foreground">{txs.length} transaction{txs.length !== 1 ? "s" : ""}</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {txs.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">No transactions yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Description", "Reference", "Type", "Status", "Date", "Amount"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {txs.map((tx: { _id: string; description: string; reference: string; type: string; status: string; createdAt: string; amount: number }) => (
                    <tr key={tx._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 max-w-[200px] truncate font-medium">{tx.description}</td>
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{tx.reference}</td>
                      <td className="px-6 py-4 capitalize text-muted-foreground">{tx.type.replace("_", " ")}</td>
                      <td className="px-6 py-4">
                        <Badge variant={tx.status === "completed" ? "success" : tx.status === "failed" ? "destructive" : "secondary"} className="capitalize">
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{formatDateTime(tx.createdAt)}</td>
                      <td className={`px-6 py-4 font-semibold text-right ${txColor[tx.type] ?? ""}`}>
                        {txSign[tx.type]}{formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
