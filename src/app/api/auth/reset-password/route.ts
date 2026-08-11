import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models";
import { resetPasswordSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token) return NextResponse.json({ error: "Invalid token." }, { status: 400 });

    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword: password });
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return NextResponse.json({ error: "Reset link is invalid or has expired." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await User.findByIdAndUpdate(user._id, {
      password: hashed,
      $unset: { passwordResetToken: 1, passwordResetExpires: 1 },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[reset-password]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
