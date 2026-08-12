import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Transaction, Wallet } from "@/lib/db/models";
import { safeAdd } from "@/lib/queue/queues";
import { APP_URL } from "@/lib/constants";

const FW_SECRET = process.env.FLUTTERWAVE_SECRET_KEY!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const txRef = searchParams.get("tx_ref");
  const transactionId = searchParams.get("transaction_id");
  const status = searchParams.get("status");

  if (status !== "successful" || !txRef || !transactionId) {
    return NextResponse.redirect(`${APP_URL}/dashboard/wallet?error=payment_failed`);
  }

  try {
    // Verify with Flutterwave
    const verifyRes = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
      headers: { Authorization: `Bearer ${FW_SECRET}` },
    });
    const verifyData = await verifyRes.json();

    if (verifyData.data?.status !== "successful") {
      return NextResponse.redirect(`${APP_URL}/dashboard/wallet?error=payment_failed`);
    }

    await connectDB();
    const tx = await Transaction.findOne({ reference: txRef, status: "pending" });
    if (!tx) return NextResponse.redirect(`${APP_URL}/dashboard/wallet?error=already_processed`);

    const wallet = await Wallet.findByIdAndUpdate(
      tx.walletId,
      { $inc: { balance: tx.amount, totalDeposited: tx.amount } },
      { new: true }
    );

    if (!wallet) return NextResponse.redirect(`${APP_URL}/dashboard/wallet?error=wallet_error`);

    await Transaction.findByIdAndUpdate(tx._id, {
      status: "completed",
      externalReference: transactionId,
      balanceAfter: wallet.balance,
    });

    await safeAdd("email", "deposit-confirmed-fw", {
      type: "deposit-confirmed",
      userId: tx.userId.toString(),
      email: verifyData.data.customer.email,
      amount: tx.amount,
      reference: txRef,
    });

    await safeAdd("notification", "deposit-notif-fw", {
      userId: tx.userId.toString(),
      type: "wallet",
      title: "Deposit successful",
      message: `₦${tx.amount.toLocaleString()} has been added to your wallet.`,
      actionUrl: "/dashboard/wallet",
    });

    return NextResponse.redirect(`${APP_URL}/dashboard/wallet?success=deposit_confirmed`);
  } catch (err) {
    console.error("[wallet verify-fw]", err);
    return NextResponse.redirect(`${APP_URL}/dashboard/wallet?error=server_error`);
  }
}
