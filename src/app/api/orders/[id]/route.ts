import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Order, Wallet } from "@/lib/db/models";
import { getProviderManager } from "@/lib/providers";
import { adjustWalletBalance } from "@/lib/services/wallet.service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const order = await Order.findOne({ _id: id, userId: session.user.id })
    .populate("serviceId", "name")
    .lean();

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // Sync status from provider if active
  if (order.externalOrderId && ["pending", "processing"].includes(order.status)) {
    try {
      const manager = getProviderManager();
      const status = await manager.getOrderStatus(order.externalOrderId);
      await Order.findByIdAndUpdate(id, {
        status: status.status,
        currentCount: status.currentCount,
        remains: status.remains,
        ...(status.status === "completed" ? { completedAt: new Date() } : {}),
      });
      return NextResponse.json({ success: true, data: { ...order, ...status } });
    } catch {
      // Return stale data on provider error
    }
  }

  return NextResponse.json({ success: true, data: order });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (body.action !== "cancel") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  await connectDB();
  const order = await Order.findOne({ _id: id, userId: session.user.id });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (!["pending"].includes(order.status)) {
    return NextResponse.json({ error: "This order cannot be cancelled." }, { status: 400 });
  }

  // Attempt provider cancellation if the order is already created externally.
  if (order.externalOrderId) {
    const manager = getProviderManager();
    await manager.cancelOrder(order.externalOrderId).catch(() => false);
  }

  const wallet = await Wallet.findOne({ userId: order.userId });
  if (wallet) {
    await adjustWalletBalance({
      userId: String(order.userId),
      walletId: String(wallet._id),
      amount: order.charge,
      type: "refund",
      description: `Refund for cancelled order ${String(order._id)}`,
      orderId: String(order._id),
      status: "completed",
    });
  }

  await Order.findByIdAndUpdate(id, { status: "cancelled", cancelledAt: new Date() });

  return NextResponse.json({ success: true });
}
