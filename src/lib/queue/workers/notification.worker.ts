import { Worker } from "bullmq";
import redis from "@/lib/redis";
import { connectDB } from "@/lib/db/mongoose";
import { Notification } from "@/lib/db/models";
import type { NotificationJobData } from "../queues";

export const notificationWorker = new Worker<NotificationJobData>(
  "notifications",
  async (job) => {
    await connectDB();
    const { userId, type, title, message, actionUrl, metadata } = job.data;

    await Notification.create({
      userId,
      type,
      title,
      message,
      actionUrl,
      metadata,
    });
  },
  {
    connection: redis,
    concurrency: 20,
  }
);

notificationWorker.on("failed", (job, err) => {
  console.error(`Notification job ${job?.id} failed:`, err.message);
});
