import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Wallet, Transaction } from "@/lib/db/models";
import { WalletPage } from "@/features/wallet/components/wallet-page";

export const metadata: Metadata = { title: "Wallet" };

export default async function WalletRoute() {
  const session = await auth();
  await connectDB();

  const [wallet, transactions] = await Promise.all([
    Wallet.findOne({ userId: session!.user.id }).lean(),
    Transaction.find({ userId: session!.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
  ]);

  return (
    <WalletPage
      wallet={JSON.parse(JSON.stringify(wallet ?? { balance: 0, totalDeposited: 0, totalSpent: 0 }))}
      transactions={JSON.parse(JSON.stringify(transactions))}
    />
  );
}
