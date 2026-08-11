import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Wallet, Order, Transaction } from "@/lib/db/models";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";

export const metadata: Metadata = { title: "Dashboard" };

async function getDashboardData(userId: string) {
  await connectDB();
  const [wallet, recentOrders, recentTransactions] = await Promise.all([
    Wallet.findOne({ userId }).lean(),
    Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("serviceId", "name")
      .lean(),
    Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const orderStats = await Order.aggregate([
    { $match: { userId: wallet?.userId } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  return {
    balance: wallet?.balance ?? 0,
    totalDeposited: wallet?.totalDeposited ?? 0,
    totalSpent: wallet?.totalSpent ?? 0,
    recentOrders: JSON.parse(JSON.stringify(recentOrders)),
    recentTransactions: JSON.parse(JSON.stringify(recentTransactions)),
    orderStats: JSON.parse(JSON.stringify(orderStats)),
  };
}

export default async function DashboardPage() {
  const session = await auth();
  const data = await getDashboardData(session!.user.id);
  return <DashboardOverview data={data} user={session!.user} />;
}
