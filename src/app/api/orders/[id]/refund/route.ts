import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { requestOrderRefund } from "@/lib/services/order.service";
import { refundSchema } from "@/lib/validations/refund";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = refundSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    await connectDB();
    await requestOrderRefund(id, session.user.id, parsed.data.reason);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[orders refund POST]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to request refund." }, { status: 500 });
  }
}
