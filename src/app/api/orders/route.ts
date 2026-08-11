import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Service, Wallet, Order, Transaction, Notification } from "@/lib/db/models";
import { createOrderSchema } from "@/lib/validations/order";
import { orderQueue, emailQueue, notificationQueue } from "@/lib/queue/queues";
import { generateReference } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    await connectDB();
    const { serviceId, link, quantity } = parsed.data;

    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return NextResponse.json({ error: "Service not found or unavailable." }, { status: 404 });
    }

    if (quantity < service.minQuantity || quantity > service.maxQuantity) {
      return NextResponse.json({
        error: `Quantity must be between ${service.minQuantity} and ${service.maxQuantity}.`
      }, { status: 400 });
    }

    const charge = parseFloat(((quantity / 1000) * service.pricePerUnit).toFixed(2));

    const wallet = await Wallet.findOne({ userId: session.user.id });
    if (!wallet || wallet.isLocked) {
      return NextResponse.json({ error: "Wallet not found or is locked." }, { status: 400 });
    }
    if (wallet.balance < charge) {
      return NextResponse.json({ error: "Insufficient wallet balance." }, { status: 400 });
    }

    // Deduct from wallet
    const balanceBefore = wallet.balance;
    await Wallet.findByIdAndUpdate(wallet._id, {
      $inc: { balance: -charge, totalSpent: charge },
    });

    // Create transaction record
    await Transaction.create({
      userId: session.user.id,
      walletId: wallet._id,
      type: "order_payment",
      status: "completed",
      amount: charge,
      balanceBefore,
      balanceAfter: balanceBefore - charge,
      currency: "NGN",
      reference: generateReference("ORD"),
      description: `Payment for ${service.name} (${quantity.toLocaleString()} units)`,
    });

    // Create the order
    const order = await Order.create({
      userId: session.user.id,
      serviceId: service._id,
      providerId: service.providerId,
      status: "pending",
      quantity,
      link,
      charge,
    });

    // Queue the order with the provider
    await orderQueue.add("place-order", {
      type: "place-order",
      orderId: order._id.toString(),
    });

    // Queue email + notification
    await emailQueue.add("order-placed", {
      type: "order-placed",
      userId: session.user.id,
      email: session.user.email!,
      orderId: order._id.toString(),
    });

    await notificationQueue.add("order-placed-notif", {
      userId: session.user.id,
      type: "order",
      title: "Order placed",
      message: `Your order for ${service.name} has been placed and is being processed.`,
      actionUrl: `/dashboard/orders/${order._id}`,
    });

    return NextResponse.json({
      success: true,
      data: { orderId: order._id.toString() },
    }, { status: 201 });
  } catch (err) {
    console.error("[orders POST]", err);
    return NextResponse.json({ error: "Failed to place order." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
    const status = searchParams.get("status");

    const query: Record<string, unknown> = { userId: session.user.id };
    if (status && status !== "all") query.status = status;

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate("serviceId", "name").lean(),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: { orders, total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[orders GET]", err);
    return NextResponse.json({ error: "Failed to fetch orders." }, { status: 500 });
  }
}
