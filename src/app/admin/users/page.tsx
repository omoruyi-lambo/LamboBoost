import type { Metadata } from "next";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, getInitials } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin — Users" };

export default async function AdminUsersPage() {
  await connectDB();
  const users = await User.find().sort({ createdAt: -1 }).limit(100).lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">{users.length} registered users</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["User", "Role", "Status", "Joined"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u._id.toString()} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="bg-blue-50 text-blue-700 text-xs font-semibold">
                            {getInitials(u.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="capitalize">{u.role}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      {u.isActive
                        ? <Badge variant="success">Active</Badge>
                        : <Badge variant="destructive">Suspended</Badge>}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{formatDate(u.createdAt as unknown as string)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
