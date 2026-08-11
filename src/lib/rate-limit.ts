import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";
import { NextRequest, NextResponse } from "next/server";

// In production use RateLimiterRedis instead
const limiters: Record<string, RateLimiterMemory> = {
  auth: new RateLimiterMemory({ points: 5, duration: 15 * 60 }),
  api: new RateLimiterMemory({ points: 100, duration: 15 * 60 }),
  payment: new RateLimiterMemory({ points: 10, duration: 60 }),
};

export async function rateLimit(
  req: NextRequest,
  type: keyof typeof limiters = "api"
): Promise<NextResponse | null> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ??
    req.headers.get("x-real-ip") ??
    "unknown";

  try {
    await limiters[type].consume(ip);
    return null; // Not rate limited
  } catch (err) {
    if (err instanceof RateLimiterRes) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(err.msBeforeNext / 1000)),
            "X-RateLimit-Reset": new Date(Date.now() + err.msBeforeNext).toISOString(),
          },
        }
      );
    }
    return null;
  }
}
