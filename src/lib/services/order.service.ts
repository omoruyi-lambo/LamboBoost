import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongoose";
import { Coupon, Order, OrderItem, Provider, Service, Wallet } from "@/lib/db/models";
import { adjustWalletBalance, getWalletForUser } from "@/lib/services/wallet.service";
import { getProviderManager } from "@/lib/providers";
import type { CreateOrderInput } from "@/lib/validations/order";
import { generateReference } from "@/lib/utils";

export async function createOrderForUser(userId: string, input: CreateOrderInput) {
  await connectDB();

  const service = await Service.findById(input.serviceId).populate("providerId");
  if (!service || !service.isActive) {
    throw new Error("Service not found or unavailable.");
  }

  const quantity = input.quantity;
  if (quantity < service.minQuantity || quantity > service.maxQuantity) {
    throw new Error(`Quantity must be between ${service.minQuantity} and ${service.maxQuantity}.`);
  }

  const provider = await Provider.findById(service.providerId);
  if (!provider || !provider.isActive) {
    throw new Error("Service provider is unavailable.");
  }

  const unitPrice = service.pricePerUnit;
  const rawCharge = parseFloat(((quantity / 1000) * unitPrice).toFixed(2));
  let discount = 0;
  let couponId: string | undefined;

  if (input.couponCode) {
    const coupon = await Coupon.findOne({ code: input.couponCode.toUpperCase(), isActive: true });
    if (coupon) {
      const now = new Date();
      if (coupon.expiresAt && coupon.expiresAt < now) {
        discount = 0;
      } else if (coupon.minOrderAmount && rawCharge < coupon.minOrderAmount) {
        discount = 0;
      } else if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
        discount = 0;
      } else {
        couponId = String(coupon._id);
        if (coupon.discountType === "fixed") {
          discount = coupon.discountValue;
        } else {
          discount = parseFloat(((coupon.discountValue / 100) * rawCharge).toFixed(2));
        }
        coupon.discountValue = coupon.discountValue;
        await coupon.updateOne({ $inc: { usageCount: 1 } });
      }
    }
  }

  const charge = Math.max(0, parseFloat((rawCharge - discount).toFixed(2)));

  const wallet = await getWalletForUser(userId);
  if (wallet.isLocked) {
    throw new Error("Wallet is locked.");
  }
  if (wallet.balance < charge) {
    throw new Error("Insufficient wallet balance.");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.create(
      [
        {
          userId,
          serviceId: service._id,
          providerId: provider._id,
          target: input.link,
          link: input.link,
          status: "pending",
          quantity,
          price: unitPrice,
          charge,
          notes: input.notes ?? "",
        },
      ],
      { session }
    );

    const orderRecord = order[0];

    await OrderItem.create(
      [
        {
          orderId: orderRecord._id,
          serviceId: service._id,
          providerServiceId: service.providerServiceId?.toString(),
          quantity,
          pricePerUnit: unitPrice,
          totalCharge: charge,
        },
      ],
      { session }
    );

    await adjustWalletBalance({
      userId,
      walletId: String(wallet._id),
      amount: charge,
      type: "order_payment",
      description: `Payment for ${service.name} (${quantity.toLocaleString()} units)`,
      orderId: String(orderRecord._id),
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return orderRecord;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

export async function requestOrderRefund(orderId: string, userId: string, reason?: string) {
  await connectDB();
  const order = await Order.findById(orderId);
  if (!order || order.userId.toString() !== userId) {
    throw new Error("Order not found.");
  }

  if (order.status === "refunded") {
    throw new Error("Refund has already been processed for this order.");
  }

  if (!["failed", "cancelled", "partial", "completed"].includes(order.status)) {
    throw new Error("Order cannot be refunded in its current status.");
  }

  const wallet = await Wallet.findOne({ userId: order.userId });
  if (!wallet) {
    throw new Error("Wallet not found.");
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await adjustWalletBalance({
      userId: String(order.userId),
      walletId: String(wallet._id),
      amount: order.charge,
      type: "refund",
      description: `Refund for order ${String(order._id)}${reason ? `: ${reason}` : ""}`,
      orderId: String(order._id),
      status: "completed",
      session,
    });

    await Order.findByIdAndUpdate(order._id, { status: "refunded" }, { session });
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}
