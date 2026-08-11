import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Notification } from "@/lib/db/models";

export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  await Notification.updateMany({ userId: session.user.id, isRead: false }, { isRead: true });
  return NextResponse.json({ success: true });
}
