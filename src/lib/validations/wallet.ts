import { z } from "zod";

export const depositSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .min(100, "Minimum deposit is ₦100")
    .max(10_000_000, "Maximum deposit is ₦10,000,000"),
  gateway: z.enum(["paystack", "flutterwave"], {
    required_error: "Please select a payment method",
  }),
});

export const withdrawSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .min(500, "Minimum withdrawal is ₦500"),
  bankCode: z.string().min(1, "Bank is required"),
  accountNumber: z
    .string()
    .length(10, "Account number must be 10 digits")
    .regex(/^\d+$/, "Account number must contain only digits"),
  accountName: z.string().min(2, "Account name is required"),
});

export type DepositInput = z.infer<typeof depositSchema>;
export type WithdrawInput = z.infer<typeof withdrawSchema>;
