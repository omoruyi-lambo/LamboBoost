// ─── Core Domain Types ─────────────────────────────────────────────────────

export type UserRole = "user" | "admin" | "superadmin";
export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "partial"
  | "refunded";
export type TransactionType =
  | "deposit"
  | "withdrawal"
  | "order_payment"
  | "refund"
  | "bonus"
  | "adjustment";
export type TransactionStatus = "pending" | "completed" | "failed" | "reversed";
export type PaymentGateway = "paystack" | "flutterwave" | "wallet";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type NotificationType =
  | "order"
  | "wallet"
  | "system"
  | "promotion"
  | "support";

// ─── User ──────────────────────────────────────────────────────────────────

export interface IUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Wallet ────────────────────────────────────────────────────────────────

export interface IWallet {
  _id: string;
  userId: string;
  balance: number;
  currency: string;
  totalDeposited: number;
  totalWithdrawn: number;
  totalSpent: number;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Transaction ───────────────────────────────────────────────────────────

export interface ITransaction {
  _id: string;
  userId: string;
  walletId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  currency: string;
  reference: string;
  externalReference?: string;
  gateway?: PaymentGateway;
  description: string;
  metadata?: Record<string, unknown>;
  orderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Category ──────────────────────────────────────────────────────────────

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Service ───────────────────────────────────────────────────────────────

export interface IService {
  _id: string;
  categoryId: string;
  category?: ICategory;
  providerId: string;
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

// ─── Provider ──────────────────────────────────────────────────────────────

export interface IProvider {
  _id: string;
  name: string;
  slug: string;
  apiKey?: string;
  apiEndpoint?: string;
  isActive: boolean;
  isDefault: boolean;
  balance?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Order ─────────────────────────────────────────────────────────────────

export interface IOrder {
  _id: string;
  userId: string;
  user?: Pick<IUser, "_id" | "name" | "email">;
  serviceId: string;
  service?: Pick<IService, "_id" | "name" | "pricePerUnit">;
  providerId: string;
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

// ─── Coupon ────────────────────────────────────────────────────────────────

export interface ICoupon {
  _id: string;
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

// ─── Notification ──────────────────────────────────────────────────────────

export interface INotification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// ─── Support Ticket ────────────────────────────────────────────────────────

export interface ISupportTicket {
  _id: string;
  userId: string;
  user?: Pick<IUser, "_id" | "name" | "email">;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  orderId?: string;
  messages: ITicketMessage[];
  assignedTo?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITicketMessage {
  _id: string;
  senderId: string;
  senderRole: UserRole;
  message: string;
  attachments?: string[];
  createdAt: Date;
}

// ─── Audit Log ─────────────────────────────────────────────────────────────

export interface IAuditLog {
  _id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

// ─── Settings ──────────────────────────────────────────────────────────────

export interface ISettings {
  _id: string;
  key: string;
  value: unknown;
  group: string;
  description?: string;
  updatedAt: Date;
}

// ─── API Response Types ────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ─── Provider Abstraction Types ────────────────────────────────────────────

export interface ProviderOrderRequest {
  serviceId: string;
  link: string;
  quantity: number;
}

export interface ProviderOrderResponse {
  externalOrderId: string;
  status: OrderStatus;
  charge?: number;
  startCount?: number;
}

export interface ProviderOrderStatus {
  externalOrderId: string;
  status: OrderStatus;
  startCount?: number;
  currentCount?: number;
  remains?: number;
}

export interface ProviderService {
  externalServiceId: string;
  name: string;
  category: string;
  rate: number;
  minQuantity: number;
  maxQuantity: number;
  description?: string;
}

export interface ProviderBalance {
  balance: number;
  currency: string;
}
