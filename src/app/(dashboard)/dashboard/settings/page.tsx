import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { SettingsPage } from "@/features/settings/components/settings-page";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsRoute() {
  const session = await auth();
  return <SettingsPage user={session!.user} />;
}
