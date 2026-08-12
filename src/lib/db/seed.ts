/**
 * Database seeder — run once to populate the mock provider and services.
 * Usage: npx tsx src/lib/db/seed.ts
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Provider, Category, Service } from "./models";

const MONGODB_URI = process.env.MONGODB_URI!;

const mockServices = [
  { category: "Instagram", externalId: "mock-ig-001", name: "Instagram Followers – High Quality", rate: 0.25, min: 100, max: 50000, hours: 24 },
  { category: "Instagram", externalId: "mock-ig-002", name: "Instagram Likes – Instant", rate: 0.08, min: 50, max: 100000, hours: 1 },
  { category: "Instagram", externalId: "mock-ig-003", name: "Instagram Views – Reel & Video", rate: 0.03, min: 500, max: 500000, hours: 1 },
  { category: "TikTok", externalId: "mock-tt-001", name: "TikTok Followers – Premium", rate: 0.30, min: 100, max: 100000, hours: 12 },
  { category: "TikTok", externalId: "mock-tt-002", name: "TikTok Likes – Fast", rate: 0.06, min: 100, max: 500000, hours: 1 },
  { category: "TikTok", externalId: "mock-tt-003", name: "TikTok Video Views", rate: 0.02, min: 1000, max: 10000000, hours: 1 },
  { category: "YouTube", externalId: "mock-yt-001", name: "YouTube Subscribers – Retained", rate: 0.80, min: 100, max: 20000, hours: 48 },
  { category: "YouTube", externalId: "mock-yt-002", name: "YouTube Views – High Retention", rate: 0.12, min: 500, max: 1000000, hours: 6 },
  { category: "Twitter/X", externalId: "mock-tw-001", name: "Twitter/X Followers", rate: 0.18, min: 100, max: 100000, hours: 24 },
  { category: "Facebook", externalId: "mock-fb-001", name: "Facebook Page Likes", rate: 0.35, min: 100, max: 50000, hours: 24 },
  { category: "Spotify", externalId: "mock-sp-001", name: "Spotify Streams – Music", rate: 0.15, min: 1000, max: 1000000, hours: 12 },
  { category: "Telegram", externalId: "mock-tg-001", name: "Telegram Channel Members", rate: 0.22, min: 100, max: 100000, hours: 6 },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // Upsert mock provider
  const provider = await Provider.findOneAndUpdate(
    { slug: "mock" },
    { name: "Mock Provider", slug: "mock", isActive: true, isDefault: true },
    { upsert: true, new: true }
  );
  console.log("Provider:", provider.name);

  // Upsert categories and services
  for (const svc of mockServices) {
    const slugify = (await import("slugify")).default;
    const slug = slugify(svc.category, { lower: true, strict: true });

    const category = await Category.findOneAndUpdate(
      { slug },
      { name: svc.category, slug, isActive: true },
      { upsert: true, new: true }
    );

    const serviceSlug = `${slugify(svc.name, { lower: true, strict: true })}-${slugify(svc.category, { lower: true, strict: true })}`;
    await Service.findOneAndUpdate(
      { providerId: provider._id, externalServiceId: svc.externalId },
      {
        categoryId: category._id,
        providerId: provider._id,
        externalServiceId: svc.externalId,
        slug: serviceSlug,
        name: svc.name,
        platform: svc.category,
        description: `${svc.name}. Minimum: ${svc.min.toLocaleString()}, Maximum: ${svc.max.toLocaleString()} units.`,
        pricePerUnit: svc.rate,
        price: svc.rate,
        minQuantity: svc.min,
        maxQuantity: svc.max,
        minimumQuantity: svc.min,
        maximumQuantity: svc.max,
        estimatedDeliveryHours: svc.hours,
        isActive: true,
        active: true,
      },
      { upsert: true, new: true }
    );
    console.log("Seeded:", svc.name);
  }

  console.log("\nSeed complete!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
