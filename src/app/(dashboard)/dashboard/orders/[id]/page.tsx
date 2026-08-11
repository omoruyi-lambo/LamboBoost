import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/lib/db/models";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency, formatDateTime, percentage } from "@/lib/utils";

export const metadata: Metadata = { title: "Order details" };

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
  completed: "success", processing: "default", pending: "warning",
  failed: "destructive", cancelled: "destructive", partial: "secondary", refunded: "outline",
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  await connectDB();

  const order = await Order.findOne({ _id: id, userId: session!.user.id })
    .populate("serviceId", "name description estimatedDeliveryHours")
    .lean();

  if (!order) notFound();

  const o = JSON.parse(JSON.stringify(order)) as typeof order;
  const prog = o.startCount != null && o.quantity > 0
    ? percentage((o.currentCount ?? o.startCount) - o.startCount, o.quantity)
    : o.status === "completed" ? 100 : 0;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link href="/dashboard/orders"><FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="font-display text-xl font-bold text-navy-900">
            Order #{(o._id as string).slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-muted-foreground">{formatDateTime(o.createdAt as unknown as string)}</p>
        </div>
        <Badge variant={statusVariant[o.status] ?? "outline"} className="capitalize ml-auto">
          {o.status}
        </Badge>
      </div>

      <Card>
        <CardHeader><CardTitle>Progress</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Progress value={prog} />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Start count: <strong>{o.startCount?.toLocaleString() ?? "—"}</strong></span>
            <span className="text-muted-foreground">Remains: <strong>{o.remains?.toLocaleString() ?? "—"}</strong></span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Order details</CardTitle></CardHeader>
        <CardContent>
          <dl className="space-y-3 text-sm">
            {[
              { label: "Service", value: (o.serviceId as unknown as { name: string } | null)?.name ?? "Unknown" },
              { label: "Link", value: o.link },
              { label: "Quantity", value: o.quantity.toLocaleString() },
              { label: "Charge", value: formatCurrency(o.charge) },
              { label: "External ID", value: o.externalOrderId ?? "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-muted-foreground shrink-0">{label}</dt>
                <dd className="font-medium text-foreground text-right break-all">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
