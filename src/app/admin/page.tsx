import type { Metadata } from "next";
import { connectDB } from "@/lib/db/mongoose";
import { User, Order, Wallet, Transaction } from "@/lib/db/models";
import { AdminOverview } from "@/features/admin/components/admin-overview";

export const metadata: Metadata = { title: "Admin — Overview" };

export default async function AdminPage() {
  await connectDB();

  const [totalUsers, totalOrders, revenueAgg, recentOrders] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Transaction.aggregate([
      { $match: { type: "deposit", status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Order.find().sort({ createdAt: -1 }).limit(8)
      .populate("userId", "name email")
      .populate("serviceId", "name")
      .lean(),
  ]);

  const orderStats = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  return (
    <AdminOverview
      stats={{
        totalUsers,
        totalOrders,
        totalRevenue: revenueAgg[0]?.total ?? 0,
        orderStats: JSON.parse(JSON.stringify(orderStats)),
      }}
      recentOrders={JSON.parse(JSON.stringify(recentOrders))}
    />
  );
}
