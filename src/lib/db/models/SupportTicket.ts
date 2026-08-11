import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";
import type { TicketStatus, TicketPriority, UserRole } from "@/types";

interface ITicketMessage {
  _id: Types.ObjectId;
  senderId: Types.ObjectId;
  senderRole: UserRole;
  message: string;
  attachments: string[];
  createdAt: Date;
}

export interface ISupportTicketDocument extends Document {
  userId: Types.ObjectId;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  orderId?: Types.ObjectId;
  messages: ITicketMessage[];
  assignedTo?: Types.ObjectId;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TicketMessageSchema = new Schema<ITicketMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    attachments: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true, versionKey: false }
);

const SupportTicketSchema = new Schema<ISupportTicketDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      maxlength: 200,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    messages: [TicketMessageSchema],
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

SupportTicketSchema.index({ userId: 1, createdAt: -1 });
SupportTicketSchema.index({ status: 1 });
SupportTicketSchema.index({ priority: 1 });
SupportTicketSchema.index({ assignedTo: 1 });

const SupportTicket: Model<ISupportTicketDocument> =
  mongoose.models.SupportTicket ||
  mongoose.model<ISupportTicketDocument>("SupportTicket", SupportTicketSchema);

export default SupportTicket;
