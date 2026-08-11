import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { User, Order, Transaction, Wallet } from "@/lib/db/models";

export async function GET() {
  const session = await auth();
  if (!session?.user || !["admin", "superadmin"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const [totalUsers, totalOrders, revenueAgg, orderStats] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Transaction.aggregate([
      { $match: { type: "deposit", status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);
  return NextResponse.json({
    success: true,
    data: {
      totalUsers,
      totalOrders,
      totalRevenue: revenueAgg[0]?.total ?? 0,
      orderStats,
    },
  });
}
