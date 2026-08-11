import type { Metadata } from "next";
import { connectDB } from "@/lib/db/mongoose";
import { Service, Provider } from "@/lib/db/models";
import { AdminServicesClient } from "@/features/admin/components/admin-services-client";

export const metadata: Metadata = { title: "Admin — Services" };

export default async function AdminServicesPage() {
  await connectDB();
  const [services, providers] = await Promise.all([
    Service.find().populate("categoryId", "name").populate("providerId", "name slug").lean(),
    Provider.find().lean(),
  ]);
  return (
    <AdminServicesClient
      services={JSON.parse(JSON.stringify(services))}
      providers={JSON.parse(JSON.stringify(providers))}
    />
  );
}
