import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface IWalletDocument extends Document {
  userId: Types.ObjectId;
  balance: number;
  currency: string;
  totalDeposited: number;
  totalWithdrawn: number;
  totalSpent: number;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema = new Schema<IWalletDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, "Balance cannot be negative"],
    },
    currency: {
      type: String,
      default: "NGN",
      uppercase: true,
    },
    totalDeposited: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalWithdrawn: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

WalletSchema.index({ userId: 1 }, { unique: true });

const Wallet: Model<IWalletDocument> =
  mongoose.models.Wallet || mongoose.model<IWalletDocument>("Wallet", WalletSchema);

export default Wallet;
