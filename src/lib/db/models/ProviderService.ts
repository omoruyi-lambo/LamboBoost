import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface IProviderServiceDocument extends Document {
  providerId: Types.ObjectId;
  externalServiceId: string;
  category: string;
  platform: string;
  name: string;
  description: string;
  ratePerThousand: number;
  minQuantity: number;
  maxQuantity: number;
  estimatedDeliveryHours: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderServiceSchema = new Schema<IProviderServiceDocument>(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    externalServiceId: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    platform: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
      maxlength: 1000,
    },
    ratePerThousand: {
      type: Number,
      required: true,
      min: [0.01, "Rate must be greater than 0"],
    },
    minQuantity: {
      type: Number,
      required: true,
      min: [1, "Minimum quantity must be at least 1"],
    },
    maxQuantity: {
      type: Number,
      required: true,
      min: [1, "Maximum quantity must be at least 1"],
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ProviderServiceSchema.index({ providerId: 1, externalServiceId: 1 }, { unique: true });
ProviderServiceSchema.index({ category: 1, platform: 1, isActive: 1 });

const ProviderService: Model<IProviderServiceDocument> =
  mongoose.models.ProviderService ||
  mongoose.model<IProviderServiceDocument>("ProviderService", ProviderServiceSchema);

export default ProviderService;
