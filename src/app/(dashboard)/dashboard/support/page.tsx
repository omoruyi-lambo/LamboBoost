import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { SupportTicket } from "@/lib/db/models";
import { SupportPage } from "@/features/support/components/support-page";

export const metadata: Metadata = { title: "Support" };

export default async function SupportRoute() {
  const session = await auth();
  await connectDB();

  const tickets = await SupportTicket.find({ userId: session!.user.id })
    .sort({ updatedAt: -1 })
    .lean();

  return <SupportPage tickets={JSON.parse(JSON.stringify(tickets))} />;
}
