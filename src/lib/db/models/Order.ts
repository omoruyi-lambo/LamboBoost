import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";
import type { OrderStatus } from "@/types";

export interface IOrderDocument extends Document {
  userId: Types.ObjectId;
  serviceId: Types.ObjectId;
  providerId: Types.ObjectId;
  externalOrderId?: string;
  status: OrderStatus;
  quantity: number;
  link: string;
  charge: number;
  startCount?: number;
  currentCount?: number;
  remains?: number;
  notes?: string;
  cancelledAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrderDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    externalOrderId: {
      type: String,
      sparse: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
        "partial",
        "refunded",
      ],
      default: "pending",
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    link: {
      type: String,
      required: [true, "Link is required"],
      maxlength: 2000,
    },
    charge: {
      type: Number,
      required: true,
      min: 0,
    },
    startCount: {
      type: Number,
      min: 0,
    },
    currentCount: {
      type: Number,
      min: 0,
    },
    remains: {
      type: Number,
      min: 0,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    cancelledAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ externalOrderId: 1 }, { sparse: true });
OrderSchema.index({ providerId: 1 });
OrderSchema.index({ serviceId: 1 });
OrderSchema.index({ createdAt: -1 });

const Order: Model<IOrderDocument> =
  mongoose.models.Order || mongoose.model<IOrderDocument>("Order", OrderSchema);

export default Order;
