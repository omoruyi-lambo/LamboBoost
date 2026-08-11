"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface Service {
  _id: string;
  name: string;
  pricePerUnit: number;
  minQuantity: number;
  maxQuantity: number;
  isActive: boolean;
  categoryId: { name: string } | null;
  providerId: { name: string; slug: string } | null;
}

interface Provider {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export function AdminServicesClient({ services: initial, providers }: { services: Service[]; providers: Provider[] }) {
  const [services, setServices] = useState(initial);
  const [isPending, startTransition] = useTransition();

  async function syncServices() {
    startTransition(async () => {
      const res = await fetch("/api/admin/services", { method: "POST" });
      const body = await res.json();
      if (!res.ok) { toast.error(body.error ?? "Sync failed."); return; }
      toast.success(`Sync complete: ${body.data.created} created, ${body.data.updated} updated.`);
      window.location.reload();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">Services</h1>
          <p className="text-sm text-muted-foreground mt-1">{services.length} services</p>
        </div>
        <Button onClick={syncServices} disabled={isPending} variant="outline">
          <FontAwesomeIcon icon={faRotate} className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
          Sync from provider
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Service", "Category", "Provider", "Price/1k", "Min", "Max", "Status"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {services.map((s) => (
                  <tr key={s._id} className="hover:bg-muted/30">
                    <td className="px-6 py-3 font-medium truncate max-w-[200px]">{s.name}</td>
                    <td className="px-6 py-3 text-muted-foreground">{s.categoryId?.name ?? "—"}</td>
                    <td className="px-6 py-3 text-muted-foreground">{s.providerId?.name ?? "—"}</td>
                    <td className="px-6 py-3 font-medium">{formatCurrency(s.pricePerUnit * 1000)}</td>
                    <td className="px-6 py-3">{s.minQuantity.toLocaleString()}</td>
                    <td className="px-6 py-3">{s.maxQuantity.toLocaleString()}</td>
                    <td className="px-6 py-3">
                      <Badge variant={s.isActive ? "success" : "secondary"}>
                        {s.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
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
