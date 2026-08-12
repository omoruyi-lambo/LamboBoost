import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IRoleDocument extends Document {
  name: string;
  description?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRoleDocument>(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    isDefault: {
      type: Boolean,
      default: false,
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

RoleSchema.index({ name: 1 }, { unique: true });
RoleSchema.index({ isActive: 1 });

const Role: Model<IRoleDocument> =
  mongoose.models.Role || mongoose.model<IRoleDocument>("Role", RoleSchema);

export default Role;
