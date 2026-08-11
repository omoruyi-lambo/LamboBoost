import type { Metadata } from "next";
import { connectDB } from "@/lib/db/mongoose";
import { AuditLog } from "@/lib/db/models";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin — Logs" };

export default async function AdminLogsPage() {
  await connectDB();
  const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100).lean();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-navy-900">Audit Logs</h1>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Action", "Resource", "Resource ID", "IP", "Date"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log._id.toString()} className="hover:bg-muted/30">
                    <td className="px-6 py-3">
                      <Badge variant="outline" className="font-mono text-xs">{log.action}</Badge>
                    </td>
                    <td className="px-6 py-3 font-medium">{log.resource}</td>
                    <td className="px-6 py-3 font-mono text-xs text-muted-foreground">{log.resourceId ?? "—"}</td>
                    <td className="px-6 py-3 text-muted-foreground">{log.ip ?? "—"}</td>
                    <td className="px-6 py-3 text-muted-foreground whitespace-nowrap">{formatDateTime(log.createdAt as unknown as string)}</td>
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
