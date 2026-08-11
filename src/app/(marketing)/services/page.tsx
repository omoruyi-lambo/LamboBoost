import type { Metadata } from "next";
import { connectDB } from "@/lib/db/mongoose";
import { Service, Category } from "@/lib/db/models";
import { ServicesPageContent } from "@/features/services/components/services-page";

export const metadata: Metadata = {
  title: "Services",
  description: "Browse all available digital marketing services.",
};

export default async function ServicesPage() {
  await connectDB();
  const [services, categories] = await Promise.all([
    Service.find({ isActive: true }).populate("categoryId", "name slug").lean(),
    Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
  ]);
  return (
    <ServicesPageContent
      services={JSON.parse(JSON.stringify(services))}
      categories={JSON.parse(JSON.stringify(categories))}
    />
  );
}
