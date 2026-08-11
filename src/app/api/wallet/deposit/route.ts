import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { depositSchema } from "@/lib/validations/wallet";
import { connectDB } from "@/lib/db/mongoose";
import { Transaction, Wallet } from "@/lib/db/models";
import { generateReference } from "@/lib/utils";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = depositSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    await connectDB();
    const { amount, gateway } = parsed.data;
    const reference = generateReference("DEP");

    const wallet = await Wallet.findOne({ userId: session.user.id });
    if (!wallet) return NextResponse.json({ error: "Wallet not found." }, { status: 404 });

    // Create pending transaction
    await Transaction.create({
      userId: session.user.id,
      walletId: wallet._id,
      type: "deposit",
      status: "pending",
      amount,
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance + amount,
      currency: "NGN",
      reference,
      gateway,
      description: `Wallet deposit via ${gateway}`,
    });

    if (gateway === "paystack") {
      const psRes = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          amount: amount * 100, // Paystack uses kobo
          reference,
          callback_url: `${APP_URL}/api/wallet/verify`,
          metadata: { userId: session.user.id, walletId: wallet._id.toString() },
        }),
      });

      const psData = await psRes.json();
      if (!psData.status) {
        return NextResponse.json({ error: psData.message ?? "Payment initialization failed." }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        data: { authorizationUrl: psData.data.authorization_url, reference },
      });
    }

    if (gateway === "flutterwave") {
      const fwRes = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tx_ref: reference,
          amount,
          currency: "NGN",
          redirect_url: `${APP_URL}/api/wallet/verify-fw`,
          customer: { email: session.user.email, name: session.user.name },
          customizations: { title: "LamboBoost Wallet Deposit" },
          meta: { userId: session.user.id, walletId: wallet._id.toString() },
        }),
      });

      const fwData = await fwRes.json();
      if (fwData.status !== "success") {
        return NextResponse.json({ error: fwData.message ?? "Payment initialization failed." }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        data: { authorizationUrl: fwData.data.link, reference },
      });
    }

    return NextResponse.json({ error: "Unsupported gateway." }, { status: 400 });
  } catch (err) {
    console.error("[wallet deposit]", err);
    return NextResponse.json({ error: "Deposit failed." }, { status: 500 });
  }
}
