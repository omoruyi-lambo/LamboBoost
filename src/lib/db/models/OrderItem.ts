import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface IOrderItemDocument extends Document {
  orderId: Types.ObjectId;
  serviceId: Types.ObjectId;
  providerServiceId?: string;
  quantity: number;
  pricePerUnit: number;
  totalCharge: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItemDocument>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    providerServiceId: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    pricePerUnit: {
      type: Number,
      required: true,
      min: [0, "Price must be at least 0"],
    },
    totalCharge: {
      type: Number,
      required: true,
      min: [0, "Charge must be at least 0"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

OrderItemSchema.index({ orderId: 1 });
OrderItemSchema.index({ serviceId: 1 });

const OrderItem: Model<IOrderItemDocument> =
  mongoose.models.OrderItem || mongoose.model<IOrderItemDocument>("OrderItem", OrderItemSchema);

export default OrderItem;
