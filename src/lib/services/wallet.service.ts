import mongoose, { type ClientSession } from "mongoose";
import { connectDB } from "@/lib/db/mongoose";
import { Transaction, Wallet, Payment } from "@/lib/db/models";
import type { TransactionType, TransactionStatus, PaymentGateway } from "@/types";
import { generateReference } from "@/lib/utils";

export interface AdjustWalletParams {
  userId: string;
  walletId: string;
  amount: number;
  type: TransactionType;
  description: string;
  gateway?: PaymentGateway;
  externalReference?: string;
  metadata?: Record<string, unknown>;
  orderId?: string;
  paymentId?: string;
  status?: TransactionStatus;
  session?: ClientSession;
}

export async function getWalletForUser(userId: string) {
  await connectDB();
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) throw new Error("Wallet not found");
  return wallet;
}

export async function adjustWalletBalance(params: AdjustWalletParams) {
  await connectDB();
  const {
    userId,
    walletId,
    amount,
    type,
    description,
    gateway,
    externalReference,
    metadata,
    orderId,
    paymentId,
    status = "completed",
    session,
  } = params;

  if (amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  const shouldUseSession = Boolean(session);
  let localSession: ClientSession | null = null;
  let inTransaction = false;

  try {
    if (!shouldUseSession) {
      localSession = await Wallet.db.startSession();
      localSession.startTransaction();
      inTransaction = true;
    }

    const currentSession = session ?? localSession!;

    const wallet = await Wallet.findOne({ _id: walletId, userId }).session(currentSession);
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    if (wallet.isLocked) {
      throw new Error("Wallet is locked");
    }

    if (type === "order_payment" || type === "withdrawal" || type === "adjustment") {
      if (wallet.balance < amount) {
        throw new Error("Insufficient wallet balance");
      }
    }

    const balanceBefore = wallet.balance;
    const balanceAfter =
      type === "order_payment" || type === "withdrawal" || type === "adjustment"
        ? balanceBefore - amount
        : balanceBefore + amount;

    const walletUpdates: Record<string, unknown> = {
      balance: balanceAfter,
    };

    if (type === "deposit") {
      walletUpdates.totalDeposited = (wallet.totalDeposited ?? 0) + amount;
    }
    if (type === "withdrawal") {
      walletUpdates.totalWithdrawn = (wallet.totalWithdrawn ?? 0) + amount;
    }
    if (type === "order_payment") {
      walletUpdates.totalSpent = (wallet.totalSpent ?? 0) + amount;
    }

    await Wallet.findByIdAndUpdate(walletId, walletUpdates, { session: currentSession });

    const transaction = await Transaction.create(
      [
        {
          userId,
          walletId,
          type,
          status,
          amount,
          balanceBefore,
          balanceAfter,
          currency: "NGN",
          reference: generateReference("TXN"),
          externalReference,
          gateway,
          description,
          metadata: metadata ?? {},
          orderId,
        },
      ],
      { session: currentSession }
    );

    if (paymentId) {
      await Payment.findByIdAndUpdate(
        paymentId,
        {
          status: status === "completed" ? "completed" : "failed",
          externalReference,
          description,
          metadata: metadata ?? {},
        },
        { session: currentSession }
      );
    }

    if (inTransaction) {
      await currentSession.commitTransaction();
    }

    return transaction[0];
  } catch (error) {
    if (inTransaction && localSession) {
      await localSession.abortTransaction();
    }
    throw error;
  } finally {
    if (localSession) {
      localSession.endSession();
    }
  }
}
