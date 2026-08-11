import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Service, Provider } from "@/lib/db/models";
import { getProviderManager } from "@/lib/providers";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !["admin", "superadmin"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const services = await Service.find().populate("categoryId", "name").populate("providerId", "name").lean();
  return NextResponse.json({ success: true, data: { services } });
}

// Sync services from provider
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !["admin", "superadmin"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connectDB();
  const manager = getProviderManager();
  const providerServices = await manager.getServices();

  const provider = await Provider.findOne({ slug: manager.activeProviderSlug });
  if (!provider) return NextResponse.json({ error: "Provider not found in DB." }, { status: 404 });

  let created = 0;
  let updated = 0;

  for (const ps of providerServices) {
    const existing = await Service.findOne({
      providerId: provider._id,
      externalServiceId: ps.externalServiceId,
    });
    if (existing) {
      await Service.findByIdAndUpdate(existing._id, {
        name: ps.name,
        pricePerUnit: ps.ratePerThousand / 1000,
        minQuantity: ps.minQuantity,
        maxQuantity: ps.maxQuantity,
        estimatedDeliveryHours: ps.estimatedDeliveryHours ?? 24,
      });
      updated++;
    } else {
      // Find or create category
      const { Category } = await import("@/lib/db/models");
      const slugify = (await import("slugify")).default;
      const slug = slugify(ps.category, { lower: true, strict: true });
      let category = await Category.findOne({ slug });
      if (!category) {
        category = await Category.create({ name: ps.category, slug, isActive: true });
      }
      await Service.create({
        categoryId: category._id,
        providerId: provider._id,
        externalServiceId: ps.externalServiceId,
        name: ps.name,
        description: ps.description ?? ps.name,
        pricePerUnit: ps.ratePerThousand / 1000,
        minQuantity: ps.minQuantity,
        maxQuantity: ps.maxQuantity,
        estimatedDeliveryHours: ps.estimatedDeliveryHours ?? 24,
        isActive: true,
      });
      created++;
    }
  }

  return NextResponse.json({ success: true, data: { created, updated } });
}
