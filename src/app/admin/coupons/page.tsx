import type { Metadata } from "next";
import { connectDB } from "@/lib/db/mongoose";
import { Coupon } from "@/lib/db/models";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin — Coupons" };

export default async function AdminCouponsPage() {
  await connectDB();
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-navy-900">Coupons</h1>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Code", "Type", "Value", "Usage", "Expires", "Status"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coupons.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No coupons yet.</td></tr>
              ) : coupons.map((c) => (
                <tr key={c._id.toString()} className="hover:bg-muted/30">
                  <td className="px-6 py-4 font-mono font-bold text-navy-900">{c.code}</td>
                  <td className="px-6 py-4 capitalize text-muted-foreground">{c.discountType}</td>
                  <td className="px-6 py-4 font-medium">
                    {c.discountType === "percentage" ? `${c.discountValue}%` : `₦${c.discountValue}`}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {c.usageCount}{c.maxUsage ? ` / ${c.maxUsage}` : ""}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {c.expiresAt ? formatDate(c.expiresAt as unknown as string) : "Never"}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={c.isActive ? "success" : "secondary"}>{c.isActive ? "Active" : "Inactive"}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
