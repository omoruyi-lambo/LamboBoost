import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models";
import { ProfilePage } from "@/features/profile/components/profile-page";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfileRoute() {
  const session = await auth();
  await connectDB();

  const user = await User.findById(session!.user.id).lean();
  if (!user) return null;

  return <ProfilePage user={JSON.parse(JSON.stringify(user))} />;
}
