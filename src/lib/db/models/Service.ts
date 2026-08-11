import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface IServiceDocument extends Document {
  categoryId: Types.ObjectId;
  providerId: Types.ObjectId;
  externalServiceId: string;
  name: string;
  description: string;
  pricePerUnit: number;
  minQuantity: number;
  maxQuantity: number;
  estimatedDeliveryHours: number;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IServiceDocument>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    externalServiceId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: 1000,
    },
    pricePerUnit: {
      type: Number,
      required: true,
      min: [0.01, "Price must be greater than 0"],
    },
    minQuantity: {
      type: Number,
      required: true,
      min: [1, "Minimum quantity must be at least 1"],
    },
    maxQuantity: {
      type: Number,
      required: true,
    },
    estimatedDeliveryHours: {
      type: Number,
      default: 24,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ServiceSchema.index({ categoryId: 1, isActive: 1 });
ServiceSchema.index({ providerId: 1, externalServiceId: 1 });
ServiceSchema.index({ isActive: 1 });
ServiceSchema.index({ tags: 1 });
ServiceSchema.index({ name: "text", description: "text", tags: "text" });

const Service: Model<IServiceDocument> =
  mongoose.models.Service || mongoose.model<IServiceDocument>("Service", ServiceSchema);

export default Service;
