import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, getInitials } from "@/lib/utils";
import { UserActions } from "@/features/admin/components/user-actions";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminTable } from "@/features/admin/components/admin-table";

export const metadata: Metadata = { title: "Admin — Users" };

export default async function AdminUsersPage() {
  const session = await auth();
  await connectDB();
  const users = await User.find().sort({ createdAt: -1 }).limit(100).lean();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Users" description={`${users.length} registered users on the platform.`} />
      <AdminTable headers={["User", "Role", "Status", "Joined", "Actions"]}>
        {users.map((u) => (
          <tr key={u._id.toString()} className="transition-colors hover:bg-ice/60">
            <td className="px-5 py-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-[#E0F2FE] text-[#0369A1] text-xs font-semibold">
                    {getInitials(u.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-ink">{u.name}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </div>
              </div>
            </td>
            <td className="px-5 py-4">
              <Badge variant="outline" className="capitalize">{u.role}</Badge>
            </td>
            <td className="px-5 py-4">
              {u.isActive
                ? <Badge variant="success">Active</Badge>
                : <Badge variant="destructive">Suspended</Badge>}
            </td>
            <td className="px-5 py-4 text-slate-500">{formatDate(u.createdAt as unknown as string)}</td>
            <td className="px-5 py-4">
              <UserActions
                userId={u._id.toString()}
                role={u.role as "user" | "admin" | "superadmin"}
                isActive={u.isActive}
                viewerId={session?.user?.id ?? ""}
                viewerRole={(session?.user?.role as "user" | "admin" | "superadmin") ?? "user"}
              />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
