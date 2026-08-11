import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !["admin", "superadmin"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20"));
  const status = searchParams.get("status");
  const query: Record<string, unknown> = {};
  if (status && status !== "all") query.status = status;
  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("userId", "name email")
      .populate("serviceId", "name")
      .lean(),
    Order.countDocuments(query),
  ]);
  return NextResponse.json({ success: true, data: { orders, total, page, totalPages: Math.ceil(total / limit) } });
}
