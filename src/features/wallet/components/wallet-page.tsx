import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface WalletPageProps {
  wallet: {
    balance: number;
    totalDeposited: number;
    totalSpent: number;
    currency?: string;
  };
  transactions: Array<{
    _id: string;
    type: string;
    amount: number;
    status: string;
    reference: string;
    createdAt: string;
  }>;
}

export function WalletPage({ wallet, transactions }: WalletPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">Wallet</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your wallet balance and recent transactions.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/wallet/deposit">Add funds</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="text-3xl font-semibold text-navy-900">{formatCurrency(wallet.balance)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Total deposited</p>
            <p className="text-2xl font-semibold text-navy-900">{formatCurrency(wallet.totalDeposited)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Total spent</p>
            <p className="text-2xl font-semibold text-navy-900">{formatCurrency(wallet.totalSpent)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Type', 'Amount', 'Reference', 'Status', 'Date'].map((label) => (
                    <th key={label} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-muted/30">
                    <td className="px-5 py-4 capitalize text-muted-foreground">{tx.type.replace('_', ' ')}</td>
                    <td className="px-5 py-4 font-medium">{formatCurrency(tx.amount)}</td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground truncate max-w-[180px]">{tx.reference}</td>
                    <td className="px-5 py-4">
                      <Badge variant={tx.status === 'completed' ? 'success' : tx.status === 'failed' ? 'destructive' : 'outline'} className="capitalize">
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">{formatDateTime(tx.createdAt)}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">
                      No wallet transactions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
