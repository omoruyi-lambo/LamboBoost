import { z } from "zod";

export const refundSchema = z.object({
  reason: z.string().max(500, "Reason cannot exceed 500 characters").optional(),
});

export type RefundInput = z.infer<typeof refundSchema>;
