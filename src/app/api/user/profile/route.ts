import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models";
import { updateProfileSchema } from "@/lib/validations/profile";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    await connectDB();
    const updated = await User.findByIdAndUpdate(
      session.user.id,
      { name: parsed.data.name, ...(parsed.data.image ? { image: parsed.data.image } : {}) },
      { new: true }
    ).lean();

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[profile PATCH]", err);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}
