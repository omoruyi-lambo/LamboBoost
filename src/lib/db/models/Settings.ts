import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ISettingsDocument extends Document {
  key: string;
  value: unknown;
  group: string;
  description?: string;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettingsDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    group: {
      type: String,
      required: true,
      default: "general",
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
    versionKey: false,
  }
);

SettingsSchema.index({ key: 1 }, { unique: true });
SettingsSchema.index({ group: 1 });

const Settings: Model<ISettingsDocument> =
  mongoose.models.Settings ||
  mongoose.model<ISettingsDocument>("Settings", SettingsSchema);

export default Settings;
