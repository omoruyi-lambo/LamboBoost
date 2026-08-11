"use client";

import { useState, useTransition } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";

interface Notif {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

const typeColor: Record<string, string> = {
  order: "bg-blue-50 text-blue-600",
  wallet: "bg-emerald-50 text-emerald-600",
  system: "bg-gray-50 text-gray-600",
  promotion: "bg-blue-50 text-blue-700",
  support: "bg-slate-100 text-slate-700",
};

export function NotificationsPage({ notifications }: { notifications: Notif[] }) {
  const [items, setItems] = useState(notifications);
  const [isPending, startTransition] = useTransition();

  const unread = items.filter((n) => !n.isRead).length;

  async function markAllRead() {
    const res = await fetch("/api/notifications/mark-all-read", { method: "POST" });
    if (res.ok) {
      startTransition(() => setItems((prev) => prev.map((n) => ({ ...n, isRead: true }))));
      toast.success("All notifications marked as read.");
    }
  }

  async function markRead(id: string) {
    await fetch(`/api/notifications/${id}/read`, { method: "POST" });
    setItems((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unread > 0 ? `${unread} unread` : "All caught up"}
          </p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={isPending}>
            <FontAwesomeIcon icon={faCheckDouble} className="h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <FontAwesomeIcon icon={faBell} className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No notifications yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((n) => (
                <li
                  key={n._id}
                  className={`flex gap-4 px-6 py-4 transition-colors ${!n.isRead ? "bg-blue-50/45" : "hover:bg-muted/30"}`}
                  onClick={() => !n.isRead && markRead(n._id)}
                >
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${typeColor[n.type] ?? "bg-muted text-muted-foreground"}`}>
                    {n.type[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium ${!n.isRead ? "text-navy-900" : "text-foreground"}`}>
                        {n.title}
                      </p>
                      {!n.isRead && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(n.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
