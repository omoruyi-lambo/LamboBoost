import type { Metadata } from "next";
import { connectDB } from "@/lib/db/mongoose";
import { SupportTicket } from "@/lib/db/models";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin — Support" };

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline" | "success"> = {
  open: "default", in_progress: "default", resolved: "success", closed: "secondary",
};

const priorityVariant: Record<string, "default" | "secondary" | "destructive" | "outline" | "warning"> = {
  low: "secondary", medium: "outline", high: "default", urgent: "destructive",
};

export default async function AdminSupportPage() {
  await connectDB();
  const tickets = await SupportTicket.find()
    .sort({ updatedAt: -1 })
    .limit(100)
    .populate("userId", "name email")
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900">Support Tickets</h1>
        <p className="text-sm text-muted-foreground mt-1">{tickets.length} tickets</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["User", "Subject", "Priority", "Status", "Updated"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tickets.map((t) => {
                  const user = t.userId as { name: string; email: string } | null;
                  return (
                    <tr key={t._id.toString()} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <p className="font-medium">{user?.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </td>
                      <td className="px-6 py-4 max-w-[220px] truncate">{t.subject}</td>
                      <td className="px-6 py-4">
                        <Badge variant={priorityVariant[t.priority] ?? "outline"} className="capitalize">{t.priority}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusVariant[t.status] ?? "outline"} className="capitalize">{t.status.replace("_", " ")}</Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{formatRelativeTime(t.updatedAt as unknown as string)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
