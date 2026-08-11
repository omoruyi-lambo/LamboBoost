import type { Metadata } from "next";
import { connectDB } from "@/lib/db/mongoose";
import { Settings } from "@/lib/db/models";
import { AdminSettingsClient } from "@/features/admin/components/admin-settings-client";

export const metadata: Metadata = { title: "Admin — Settings" };

export default async function AdminSettingsPage() {
  await connectDB();
  const settings = await Settings.find().lean();
  return <AdminSettingsClient settings={JSON.parse(JSON.stringify(settings))} />;
}
