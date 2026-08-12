import { Queue, type QueueOptions } from "bullmq";
import redis from "@/lib/redis";

// Queues are created LAZILY, not at module scope. BullMQ's Queue constructor
// issues commands eagerly, so constructing at import time attempts a Redis
// connection. Next.js preloads route modules during static generation, which
// would crash the build (and any cold start) when Redis is unreachable.
// Lazily creating queues keeps module import side-effect free.

// ─── Queue Definitions ──────────────────────────────────────────────────────

export type QueueName = "email" | "order" | "notification";

const queueOptions: Record<QueueName, QueueOptions> = {
  email: {
    connection: redis,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 200 },
    },
  },
  order: {
    connection: redis,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 3000 },
      removeOnComplete: { count: 200 },
      removeOnFail: { count: 500 },
    },
  },
  notification: {
    connection: redis,
    defaultJobOptions: {
      attempts: 2,
      backoff: { type: "fixed", delay: 1000 },
      removeOnComplete: { count: 50 },
      removeOnFail: { count: 100 },
    },
  },
};

const queues: Partial<Record<QueueName, Queue>> = {};

export function getQueue(name: QueueName): Queue {
  if (!queues[name]) {
    queues[name] = new Queue(name, queueOptions[name]);
  }
  return queues[name];
}

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

/**
 * Enqueue a job without letting a Redis outage break the primary action.
 * Emails and notifications are best-effort: if the queue is unreachable,
 * the job is skipped with a warning instead of throwing.
 */
export async function safeAdd<T extends Record<string, unknown>>(
  queue: QueueName,
  name: string,
  data: T,
  opts?: { jobId?: string }
): Promise<void> {
  try {
    await getQueue(queue).add(name, data, opts);
  } catch (err) {
    console.warn(
      `[queue] "${name}" job skipped (Redis unavailable):`,
      (err as Error).message
    );
  }
}
