import { Worker } from "bullmq";
import redis from "@/lib/redis";
import { connectDB } from "@/lib/db/mongoose";
import { Order, Wallet, Transaction, Notification } from "@/lib/db/models";
import { getProviderManager } from "@/lib/providers";
import type { OrderJobData } from "../queues";
import { generateReference } from "@/lib/utils";

export const orderWorker = new Worker<OrderJobData>(
  "orders",
  async (job) => {
    await connectDB();
    const data = job.data;

    if (data.type === "place-order") {
      const order = (await Order.findById(data.orderId).populate("serviceId")) as any;
      if (!order) throw new Error(`Order ${data.orderId} not found`);

      const service = order.serviceId as { externalServiceId: string };
      const manager = getProviderManager();

      try {
        const result = await manager.createOrder({
          externalServiceId: service.externalServiceId,
          link: order.link,
          quantity: order.quantity,
          internalOrderId: order._id.toString(),
        });

        await Order.findByIdAndUpdate(order._id, {
          externalOrderId: result.externalOrderId,
          status: result.status,
          startCount: result.startCount,
        });
      } catch (err) {
        // Refund user on placement failure
        await Order.findByIdAndUpdate(order._id, { status: "failed" });

        const wallet = await Wallet.findOne({ userId: order.userId });
        if (wallet) {
          const balanceBefore = wallet.balance;
          await Wallet.findByIdAndUpdate(wallet._id, {
            $inc: { balance: order.charge, totalSpent: -order.charge },
          });
          await Transaction.create({
            userId: order.userId,
            walletId: wallet._id,
            type: "refund",
            status: "completed",
            amount: order.charge,
            balanceBefore,
            balanceAfter: balanceBefore + order.charge,
            currency: "NGN",
            reference: generateReference("RFD"),
            description: `Refund for failed order #${order._id}`,
            orderId: order._id,
          });
        }

        throw err;
      }
    }

    if (data.type === "sync-status") {
      const manager = new (await import("@/lib/providers")).ProviderManager(
        data.providerSlug
      );
      const result = await manager.getOrderStatus(data.externalOrderId);

      await Order.findByIdAndUpdate(data.orderId, {
        status: result.status,
        currentCount: result.currentCount,
        remains: result.remains,
        ...(result.status === "completed" ? { completedAt: new Date() } : {}),
      });
    }

    if (data.type === "check-all-active") {
      const activeOrders = await Order.find({
        status: { $in: ["pending", "processing"] },
        externalOrderId: { $exists: true },
      }).limit(100);

      for (const order of activeOrders) {
        const manager = new (await import("@/lib/providers")).ProviderManager();
        const result = await manager.getOrderStatus(order.externalOrderId!);

        await Order.findByIdAndUpdate(order._id, {
          status: result.status,
          currentCount: result.currentCount,
          remains: result.remains,
          ...(result.status === "completed" ? { completedAt: new Date() } : {}),
        });
      }
    }
  },
  {
    connection: redis,
    concurrency: 10,
  }
);

orderWorker.on("completed", (job) => {
  console.log(`Order job ${job.id} (${job.data.type}) completed`);
});

orderWorker.on("failed", (job, err) => {
  console.error(`Order job ${job?.id} failed:`, err.message);
});
