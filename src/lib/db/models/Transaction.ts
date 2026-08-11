import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";
import type { TransactionType, TransactionStatus, PaymentGateway } from "@/types";

export interface ITransactionDocument extends Document {
  userId: Types.ObjectId;
  walletId: Types.ObjectId;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  currency: string;
  reference: string;
  externalReference?: string;
  gateway?: PaymentGateway;
  description: string;
  metadata?: Record<string, unknown>;
  orderId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransactionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    walletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    type: {
      type: String,
      enum: ["deposit", "withdrawal", "order_payment", "refund", "bonus", "adjustment"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "reversed"],
      default: "pending",
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, "Amount must be greater than 0"],
    },
    balanceBefore: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceAfter: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "NGN",
      uppercase: true,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    externalReference: {
      type: String,
      sparse: true,
    },
    gateway: {
      type: String,
      enum: ["paystack", "flutterwave", "wallet"],
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ reference: 1 }, { unique: true });
TransactionSchema.index({ externalReference: 1 }, { sparse: true });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ gateway: 1 });

const Transaction: Model<ITransactionDocument> =
  mongoose.models.Transaction ||
  mongoose.model<ITransactionDocument>("Transaction", TransactionSchema);

export default Transaction;
