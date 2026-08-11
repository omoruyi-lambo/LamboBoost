import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Announcements" };

export default function AdminAnnouncementsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-navy-900">Announcements</h1>
      <p className="text-sm text-muted-foreground">
        Send platform-wide announcements to all users. This feature is available in the next release.
      </p>
    </div>
  );
}
