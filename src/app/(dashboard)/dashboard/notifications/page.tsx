import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Notification } from "@/lib/db/models";
import { NotificationsPage } from "@/features/notifications/components/notifications-page";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsRoute() {
  const session = await auth();
  await connectDB();

  const notifications = await Notification.find({ userId: session!.user.id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return <NotificationsPage notifications={JSON.parse(JSON.stringify(notifications))} />;
}
