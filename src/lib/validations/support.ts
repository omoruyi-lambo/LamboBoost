import { z } from "zod";

export const createTicketSchema = z.object({
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject is too long"),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(5000, "Message is too long"),
  orderId: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export const replyTicketSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(5000, "Message is too long"),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type ReplyTicketInput = z.infer<typeof replyTicketSchema>;
