"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Setting { _id: string; key: string; value: unknown; group: string; description?: string }

export function AdminSettingsClient({ settings }: { settings: Setting[] }) {
  const groups = [...new Set(settings.map((s) => s.group))];

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-navy-900">Settings</h1>
      {groups.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No settings configured yet.
          </CardContent>
        </Card>
      ) : (
        groups.map((group) => (
          <Card key={group}>
            <CardHeader>
              <CardTitle className="capitalize">{group}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {settings.filter((s) => s.group === group).map((s) => (
                <div key={s._id} className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground font-mono">{s.key}</p>
                    {s.description && <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>}
                  </div>
                  <Badge variant="outline" className="font-mono text-xs shrink-0">
                    {JSON.stringify(s.value)}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
