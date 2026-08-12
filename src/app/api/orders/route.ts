import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models";
import { orderQueue, emailQueue, notificationQueue, safeAdd } from "@/lib/queue/queues";
import { createOrderSchema } from "@/lib/validations/order";
import { createOrderForUser } from "@/lib/services/order.service";

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

    const order = await createOrderForUser(session.user.id, {
      serviceId,
      link,
      quantity,
      couponCode: parsed.data.couponCode,
      notes: parsed.data.notes,
    });

    const orderId = (order._id as unknown as string);

    // Queue the order with the provider
    await safeAdd(orderQueue, "place-order", {
      type: "place-order",
      orderId,
    });

    // Queue email + notification
    await safeAdd(emailQueue, "order-placed", {
      type: "order-placed",
      userId: session.user.id,
      email: session.user.email!,
      orderId,
    });

    await safeAdd(notificationQueue, "order-placed-notif", {
      userId: session.user.id,
      type: "order",
      title: "Order placed",
      message: `Your order has been placed and is being processed.`,
      actionUrl: `/dashboard/orders/${orderId}`,
    });

    return NextResponse.json({
      success: true,
      data: { orderId: String(order._id) },
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
