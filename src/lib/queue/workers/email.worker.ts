import { Worker } from "bullmq";
import redis from "@/lib/redis";
import { sendWelcomeEmail } from "@/lib/email/templates/welcome";
import { sendVerifyEmail } from "@/lib/email/templates/verify-email";
import { sendResetPasswordEmail } from "@/lib/email/templates/reset-password";
import { sendOrderPlacedEmail } from "@/lib/email/templates/order-placed";
import { sendDepositConfirmedEmail } from "@/lib/email/templates/deposit-confirmed";
import type { EmailJobData } from "../queues";

export const emailWorker = new Worker<EmailJobData>(
  "email",
  async (job) => {
    const data = job.data;

    switch (data.type) {
      case "welcome":
        await sendWelcomeEmail({ name: data.name, email: data.email });
        break;
      case "verify-email":
        await sendVerifyEmail({
          name: data.name,
          email: data.email,
          token: data.token,
        });
        break;
      case "reset-password":
        await sendResetPasswordEmail({
          name: data.name,
          email: data.email,
          token: data.token,
        });
        break;
      case "order-placed":
        await sendOrderPlacedEmail({
          email: data.email,
          orderId: data.orderId,
        });
        break;
      case "deposit-confirmed":
        await sendDepositConfirmedEmail({
          email: data.email,
          amount: data.amount,
          reference: data.reference,
        });
        break;
      default:
        console.warn("Unknown email job type:", (data as { type: string }).type);
    }
  },
  {
    connection: redis,
    concurrency: 5,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`Email job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Email job ${job?.id} failed:`, err.message);
});
