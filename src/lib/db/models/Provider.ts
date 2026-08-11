import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IProviderDocument extends Document {
  name: string;
  slug: string;
  apiKey?: string;
  apiEndpoint?: string;
  isActive: boolean;
  isDefault: boolean;
  balance?: number;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderSchema = new Schema<IProviderDocument>(
  {
    name: {
      type: String,
      required: [true, "Provider name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    apiKey: {
      type: String,
      select: false,
    },
    apiEndpoint: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    balance: {
      type: Number,
      default: 0,
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

ProviderSchema.index({ slug: 1 }, { unique: true });
ProviderSchema.index({ isActive: 1, isDefault: 1 });

const Provider: Model<IProviderDocument> =
  mongoose.models.Provider ||
  mongoose.model<IProviderDocument>("Provider", ProviderSchema);

export default Provider;
