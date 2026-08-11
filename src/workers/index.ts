/**
 * Worker entrypoint — run with: npm run worker
 * Starts all BullMQ workers in a single long-running process.
 */

import { emailWorker } from "@/lib/queue/workers/email.worker";
import { orderWorker } from "@/lib/queue/workers/order.worker";
import { notificationWorker } from "@/lib/queue/workers/notification.worker";

console.log("🚀 Workers started");
console.log("  - Email worker:", emailWorker.name);
console.log("  - Order worker:", orderWorker.name);
console.log("  - Notification worker:", notificationWorker.name);

process.on("SIGTERM", async () => {
  console.log("Shutting down workers...");
  await emailWorker.close();
  await orderWorker.close();
  await notificationWorker.close();
  process.exit(0);
});
