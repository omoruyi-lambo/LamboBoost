import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ICouponDocument extends Document {
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxUsage?: number;
  usageCount: number;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICouponDocument>(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 50,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: [0.01, "Discount value must be greater than 0"],
    },
    minOrderAmount: {
      type: Number,
      min: 0,
    },
    maxUsage: {
      type: Number,
      min: 1,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

CouponSchema.index({ code: 1 }, { unique: true });
CouponSchema.index({ isActive: 1 });
CouponSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

const Coupon: Model<ICouponDocument> =
  mongoose.models.Coupon || mongoose.model<ICouponDocument>("Coupon", CouponSchema);

export default Coupon;
