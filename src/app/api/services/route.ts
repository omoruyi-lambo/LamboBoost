import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Service, Category } from "@/lib/db/models";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "50"));

    const query: Record<string, unknown> = { isActive: true };
    if (q) query.$text = { $search: q };

    if (category && category !== "all") {
      const cat = await Category.findOne({ slug: category, isActive: true });
      if (cat) query.categoryId = cat._id;
    }

    const [services, total] = await Promise.all([
      Service.find(query)
        .populate("categoryId", "name slug")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Service.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: { services, total, page, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[services GET]", err);
    return NextResponse.json({ error: "Failed to fetch services." }, { status: 500 });
  }
}
