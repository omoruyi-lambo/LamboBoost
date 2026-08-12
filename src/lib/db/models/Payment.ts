import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";
import type { PaymentGateway } from "@/types";

export interface IPaymentDocument extends Document {
  userId: Types.ObjectId;
  walletId: Types.ObjectId;
  transactionId?: Types.ObjectId;
  gateway: PaymentGateway;
  amount: number;
  currency: string;
  reference: string;
  externalReference?: string;
  status: "pending" | "completed" | "failed";
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPaymentDocument>(
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
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
    gateway: {
      type: String,
      enum: ["paystack", "flutterwave", "wallet"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, "Amount must be greater than 0"],
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
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

PaymentSchema.index({ reference: 1 }, { unique: true });
PaymentSchema.index({ userId: 1, status: 1, createdAt: -1 });
PaymentSchema.index({ walletId: 1 });

const Payment: Model<IPaymentDocument> =
  mongoose.models.Payment || mongoose.model<IPaymentDocument>("Payment", PaymentSchema);

export default Payment;
