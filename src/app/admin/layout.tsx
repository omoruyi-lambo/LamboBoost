import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminShell } from "@/features/admin/components/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin" && session.user.role !== "superadmin") redirect("/dashboard");
  return <AdminShell user={session.user}>{children}</AdminShell>;
}
