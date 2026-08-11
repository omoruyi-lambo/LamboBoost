import { Queue } from "bullmq";
import redis from "@/lib/redis";

const connection = redis;

// ─── Queue Definitions ──────────────────────────────────────────────────────

export const emailQueue = new Queue("email", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 200 },
  },
});

export const orderQueue = new Queue("orders", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 3000 },
    removeOnComplete: { count: 200 },
    removeOnFail: { count: 500 },
  },
});

export const notificationQueue = new Queue("notifications", {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: "fixed", delay: 1000 },
    removeOnComplete: { count: 50 },
    removeOnFail: { count: 100 },
  },
});

// ─── Job Type Definitions ────────────────────────────────────────────────────

export type EmailJobData =
  | { type: "welcome"; userId: string; name: string; email: string }
  | { type: "verify-email"; userId: string; name: string; email: string; token: string }
  | { type: "reset-password"; userId: string; name: string; email: string; token: string }
  | { type: "order-placed"; userId: string; email: string; orderId: string }
  | { type: "order-completed"; userId: string; email: string; orderId: string }
  | { type: "deposit-confirmed"; userId: string; email: string; amount: number; reference: string };

export type OrderJobData =
  | { type: "sync-status"; orderId: string; externalOrderId: string; providerSlug: string }
  | { type: "place-order"; orderId: string }
  | { type: "check-all-active" };

export type NotificationJobData = {
  userId: string;
  type: "order" | "wallet" | "system" | "promotion" | "support";
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
};
