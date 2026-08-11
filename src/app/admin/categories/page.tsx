import type { Metadata } from "next";
import { connectDB } from "@/lib/db/mongoose";
import { Category, Service } from "@/lib/db/models";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Admin — Categories" };

export default async function AdminCategoriesPage() {
  await connectDB();
  const categories = await Category.find().sort({ sortOrder: 1 }).lean();
  const serviceCounts = await Service.aggregate([
    { $group: { _id: "$categoryId", count: { $sum: 1 } } },
  ]);
  const countMap = Object.fromEntries(serviceCounts.map((s) => [s._id.toString(), s.count]));

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-navy-900">Categories</h1>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Name", "Slug", "Services", "Status"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((c) => (
                <tr key={c._id.toString()} className="hover:bg-muted/30">
                  <td className="px-6 py-4 font-medium">{c.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{c.slug}</td>
                  <td className="px-6 py-4 text-muted-foreground">{countMap[c._id.toString()] ?? 0}</td>
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
