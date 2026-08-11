import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .trim(),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

export const updateNotificationPrefsSchema = z.object({
  emailOrders: z.boolean(),
  emailWallet: z.boolean(),
  emailPromotions: z.boolean(),
  emailSupport: z.boolean(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateNotificationPrefsInput = z.infer<typeof updateNotificationPrefsSchema>;
