import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface IAuditLogDocument extends Document {
  userId?: Types.ObjectId;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    action: {
      type: String,
      required: true,
      maxlength: 100,
    },
    resource: {
      type: String,
      required: true,
      maxlength: 100,
    },
    resourceId: {
      type: String,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ resource: 1, resourceId: 1 });
AuditLogSchema.index({ createdAt: -1 });
// Auto-delete audit logs after 1 year
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

const AuditLog: Model<IAuditLogDocument> =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLogDocument>("AuditLog", AuditLogSchema);

export default AuditLog;
