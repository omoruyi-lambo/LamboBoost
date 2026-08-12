import { connectDB } from "@/lib/db/mongoose";
import { Provider, ProviderService as ProviderServiceModel, Service, Category } from "@/lib/db/models";
import { getProviderManager } from "@/lib/providers";
import slugify from "slugify";

export async function syncProviderServices() {
  await connectDB();
  const manager = getProviderManager();
  const providerServices = await manager.getServices();
  const provider = await Provider.findOne({ slug: manager.activeProviderSlug });
  if (!provider) {
    throw new Error("Active provider is not registered in the database.");
  }

  let created = 0;
  let updated = 0;

  for (const ps of providerServices) {
    let category = await Category.findOne({ slug: slugify(ps.category, { lower: true, strict: true }) });
    if (!category) {
      category = await Category.create({
        name: ps.category,
        slug: slugify(ps.category, { lower: true, strict: true }),
        isActive: true,
      });
    }

    const existingProviderService = await ProviderServiceModel.findOne({
      providerId: provider._id,
      externalServiceId: ps.externalServiceId,
    });

    if (!existingProviderService) {
      await ProviderServiceModel.create({
        providerId: provider._id,
        externalServiceId: ps.externalServiceId,
        category: ps.category,
        platform: ps.category,
        name: ps.name,
        description: ps.description ?? ps.name,
        ratePerThousand: ps.ratePerThousand,
        minQuantity: ps.minQuantity,
        maxQuantity: ps.maxQuantity,
        estimatedDeliveryHours: ps.estimatedDeliveryHours ?? 24,
        isActive: true,
      });
      created++;
    } else {
      await ProviderServiceModel.findByIdAndUpdate(existingProviderService._id, {
        name: ps.name,
        description: ps.description ?? ps.name,
        ratePerThousand: ps.ratePerThousand,
        minQuantity: ps.minQuantity,
        maxQuantity: ps.maxQuantity,
        estimatedDeliveryHours: ps.estimatedDeliveryHours ?? 24,
        category: ps.category,
        platform: ps.category,
        isActive: true,
      });
      updated++;
    }

    const serviceSlug = slugify(ps.name, { lower: true, strict: true });
    const service = await Service.findOne({ providerId: provider._id, externalServiceId: ps.externalServiceId });
    if (!service) {
      await Service.create({
        categoryId: category._id,
        providerId: provider._id,
        providerServiceId: existingProviderService?._id,
        externalServiceId: ps.externalServiceId,
        slug: serviceSlug,
        name: ps.name,
        platform: ps.category,
        description: ps.description ?? ps.name,
        pricePerUnit: ps.ratePerThousand / 1000,
        price: ps.ratePerThousand / 1000,
        minQuantity: ps.minQuantity,
        maxQuantity: ps.maxQuantity,
        minimumQuantity: ps.minQuantity,
        maximumQuantity: ps.maxQuantity,
        estimatedDeliveryHours: ps.estimatedDeliveryHours ?? 24,
        isActive: true,
        active: true,
      });
    } else {
      await Service.findByIdAndUpdate(service._id, {
        providerServiceId: existingProviderService?._id,
        slug: serviceSlug,
        name: ps.name,
        platform: ps.category,
        description: ps.description ?? ps.name,
        pricePerUnit: ps.ratePerThousand / 1000,
        price: ps.ratePerThousand / 1000,
        minQuantity: ps.minQuantity,
        maxQuantity: ps.maxQuantity,
        minimumQuantity: ps.minQuantity,
        maximumQuantity: ps.maxQuantity,
        estimatedDeliveryHours: ps.estimatedDeliveryHours ?? 24,
        isActive: true,
        active: true,
      });
    }
  }

  return { created, updated };
}
