import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "noreply@lamboboost.com";
export const FROM_NAME = process.env.RESEND_FROM_NAME ?? "LamboBoost";
export const FROM = `${FROM_NAME} <${FROM_EMAIL}>`;

export default resend;
