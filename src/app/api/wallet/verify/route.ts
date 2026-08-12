import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Transaction, Wallet } from "@/lib/db/models";
import { safeAdd } from "@/lib/queue/queues";
import { APP_URL } from "@/lib/constants";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(`${APP_URL}/dashboard/wallet?error=missing_reference`);
  }

  try {
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    });
    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      return NextResponse.redirect(`${APP_URL}/dashboard/wallet?error=payment_failed`);
    }

    await connectDB();
    const tx = await Transaction.findOne({ reference, status: "pending" });
    if (!tx) {
      return NextResponse.redirect(`${APP_URL}/dashboard/wallet?error=transaction_not_found`);
    }

    // Credit wallet
    const wallet = await Wallet.findByIdAndUpdate(
      tx.walletId,
      { $inc: { balance: tx.amount, totalDeposited: tx.amount } },
      { new: true }
    );

    if (!wallet) {
      return NextResponse.redirect(`${APP_URL}/dashboard/wallet?error=wallet_error`);
    }

    // Mark transaction complete
    await Transaction.findByIdAndUpdate(tx._id, {
      status: "completed",
      externalReference: verifyData.data.reference,
      balanceAfter: wallet.balance,
    });

    // Queue confirmation email + notification
    await safeAdd("email", "deposit-confirmed", {
      type: "deposit-confirmed",
      userId: tx.userId.toString(),
      email: verifyData.data.customer.email,
      amount: tx.amount,
      reference,
    });

    await safeAdd("notification", "deposit-notif", {
      userId: tx.userId.toString(),
      type: "wallet",
      title: "Deposit successful",
      message: `₦${tx.amount.toLocaleString()} has been added to your wallet.`,
      actionUrl: "/dashboard/wallet",
    });

    return NextResponse.redirect(`${APP_URL}/dashboard/wallet?success=deposit_confirmed`);
  } catch (err) {
    console.error("[wallet verify]", err);
    return NextResponse.redirect(`${APP_URL}/dashboard/wallet?error=server_error`);
  }
}
