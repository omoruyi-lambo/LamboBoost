import { z } from "zod";

export const createOrderSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  link: z
    .string()
    .min(1, "Link is required")
    .url("Please enter a valid URL"),
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
  couponCode: z.string().optional(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export const cancelOrderSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  reason: z.string().max(500).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
