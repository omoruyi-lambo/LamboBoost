/**
 * MockProvider
 *
 * A fully simulated provider that mimics real-world API behaviour without
 * making any external network calls. Useful for development, testing, and
 * demos. Switching to a real provider requires only a configuration change.
 */

import type {
  IProviderAdapter,
  ProviderBalanceResult,
  ProviderOrderRequest,
  ProviderOrderResult,
  ProviderOrderStatusResult,
  ProviderServiceResult,
} from "../types";
import type { OrderStatus } from "@/types";
import { sleep } from "@/lib/utils";

const MOCK_SERVICES: ProviderServiceResult[] = [
  // Instagram
  {
    externalServiceId: "mock-ig-001",
    name: "Instagram Followers – High Quality",
    category: "Instagram",
    ratePerThousand: 250,
    minQuantity: 100,
    maxQuantity: 50000,
    description:
      "High-retention Instagram followers from real-looking accounts. Gradual delivery for safety.",
    estimatedDeliveryHours: 24,
  },
  {
    externalServiceId: "mock-ig-002",
    name: "Instagram Likes – Instant",
    category: "Instagram",
    ratePerThousand: 80,
    minQuantity: 50,
    maxQuantity: 100000,
    description:
      "Fast Instagram likes delivered within minutes of order placement.",
    estimatedDeliveryHours: 1,
  },
  {
    externalServiceId: "mock-ig-003",
    name: "Instagram Views – Reel & Video",
    category: "Instagram",
    ratePerThousand: 30,
    minQuantity: 500,
    maxQuantity: 500000,
    description: "Boost your reels and video view count instantly.",
    estimatedDeliveryHours: 1,
  },
  {
    externalServiceId: "mock-ig-004",
    name: "Instagram Story Views",
    category: "Instagram",
    ratePerThousand: 40,
    minQuantity: 100,
    maxQuantity: 50000,
    description: "Increase your story view count from real accounts.",
    estimatedDeliveryHours: 2,
  },
  // TikTok
  {
    externalServiceId: "mock-tt-001",
    name: "TikTok Followers – Premium",
    category: "TikTok",
    ratePerThousand: 300,
    minQuantity: 100,
    maxQuantity: 100000,
    description:
      "Premium TikTok followers with high retention rates and stable counts.",
    estimatedDeliveryHours: 12,
  },
  {
    externalServiceId: "mock-tt-002",
    name: "TikTok Likes – Fast",
    category: "TikTok",
    ratePerThousand: 60,
    minQuantity: 100,
    maxQuantity: 500000,
    description: "Boost engagement on your TikTok posts with genuine-looking likes.",
    estimatedDeliveryHours: 1,
  },
  {
    externalServiceId: "mock-tt-003",
    name: "TikTok Video Views",
    category: "TikTok",
    ratePerThousand: 20,
    minQuantity: 1000,
    maxQuantity: 10000000,
    description: "Instant TikTok video views to push content to the For You page.",
    estimatedDeliveryHours: 1,
  },
  // YouTube
  {
    externalServiceId: "mock-yt-001",
    name: "YouTube Subscribers – Retained",
    category: "YouTube",
    ratePerThousand: 800,
    minQuantity: 100,
    maxQuantity: 20000,
    description:
      "High-quality YouTube subscribers that stay. Safe for monetized channels.",
    estimatedDeliveryHours: 48,
  },
  {
    externalServiceId: "mock-yt-002",
    name: "YouTube Views – High Retention",
    category: "YouTube",
    ratePerThousand: 120,
    minQuantity: 500,
    maxQuantity: 1000000,
    description:
      "High-retention YouTube views that count toward watch time and algorithm signals.",
    estimatedDeliveryHours: 6,
  },
  {
    externalServiceId: "mock-yt-003",
    name: "YouTube Likes",
    category: "YouTube",
    ratePerThousand: 200,
    minQuantity: 100,
    maxQuantity: 50000,
    description: "Real-looking YouTube likes to boost social proof.",
    estimatedDeliveryHours: 3,
  },
  // Twitter/X
  {
    externalServiceId: "mock-tw-001",
    name: "Twitter/X Followers",
    category: "Twitter/X",
    ratePerThousand: 180,
    minQuantity: 100,
    maxQuantity: 100000,
    description: "Grow your Twitter presence with quality followers.",
    estimatedDeliveryHours: 24,
  },
  {
    externalServiceId: "mock-tw-002",
    name: "Twitter/X Likes",
    category: "Twitter/X",
    ratePerThousand: 50,
    minQuantity: 50,
    maxQuantity: 200000,
    description: "Instant likes for your tweets and posts.",
    estimatedDeliveryHours: 1,
  },
  // Facebook
  {
    externalServiceId: "mock-fb-001",
    name: "Facebook Page Likes",
    category: "Facebook",
    ratePerThousand: 350,
    minQuantity: 100,
    maxQuantity: 50000,
    description: "Real-looking Facebook page likes from diverse accounts.",
    estimatedDeliveryHours: 24,
  },
  {
    externalServiceId: "mock-fb-002",
    name: "Facebook Post Likes",
    category: "Facebook",
    ratePerThousand: 90,
    minQuantity: 50,
    maxQuantity: 100000,
    description: "Boost engagement on your Facebook posts.",
    estimatedDeliveryHours: 2,
  },
  // Spotify
  {
    externalServiceId: "mock-sp-001",
    name: "Spotify Streams – Music",
    category: "Spotify",
    ratePerThousand: 150,
    minQuantity: 1000,
    maxQuantity: 1000000,
    description: "Boost your Spotify stream count to trigger algorithmic promotion.",
    estimatedDeliveryHours: 12,
  },
  {
    externalServiceId: "mock-sp-002",
    name: "Spotify Followers – Artist",
    category: "Spotify",
    ratePerThousand: 400,
    minQuantity: 100,
    maxQuantity: 10000,
    description: "Grow your Spotify artist following.",
    estimatedDeliveryHours: 24,
  },
  // Telegram
  {
    externalServiceId: "mock-tg-001",
    name: "Telegram Channel Members",
    category: "Telegram",
    ratePerThousand: 220,
    minQuantity: 100,
    maxQuantity: 100000,
    description: "Add real-looking members to your Telegram channel.",
    estimatedDeliveryHours: 6,
  },
  {
    externalServiceId: "mock-tg-002",
    name: "Telegram Post Views",
    category: "Telegram",
    ratePerThousand: 25,
    minQuantity: 100,
    maxQuantity: 1000000,
    description: "Increase view counts on your Telegram posts.",
    estimatedDeliveryHours: 1,
  },
];

// Simulated in-memory order store for the mock provider
const mockOrderStore = new Map<
  string,
  {
    status: OrderStatus;
    startCount: number;
    currentCount: number;
    quantity: number;
    createdAt: number;
  }
>();

function generateMockOrderId(): string {
  return `MOCK-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function simulateOrderProgress(
  orderId: string
): { status: OrderStatus; currentCount: number; remains: number } {
  const order = mockOrderStore.get(orderId);
  if (!order) {
    return { status: "failed", currentCount: 0, remains: 0 };
  }

  const ageMs = Date.now() - order.createdAt;
  const ageMinutes = ageMs / (1000 * 60);
  const progressRatio = Math.min(ageMinutes / 60, 1); // completes in ~60 minutes

  const currentCount = Math.floor(
    order.startCount + order.quantity * progressRatio
  );
  const remains = Math.max(0, order.quantity - (currentCount - order.startCount));

  let status: OrderStatus = "processing";
  if (progressRatio >= 1) {
    status = "completed";
  } else if (progressRatio > 0.05) {
    status = "processing";
  } else {
    status = "pending";
  }

  return { status, currentCount, remains };
}

export class MockProvider implements IProviderAdapter {
  readonly slug = "mock";
  readonly name = "Mock Provider";

  async getBalance(): Promise<ProviderBalanceResult> {
    await sleep(100); // simulate latency
    return { balance: 99999.99, currency: "USD" };
  }

  async getServices(): Promise<ProviderServiceResult[]> {
    await sleep(200);
    return MOCK_SERVICES;
  }

  async createOrder(request: ProviderOrderRequest): Promise<ProviderOrderResult> {
    await sleep(300);

    const service = MOCK_SERVICES.find(
      (s) => s.externalServiceId === request.externalServiceId
    );

    if (!service) {
      throw new Error(
        `Mock service not found: ${request.externalServiceId}`
      );
    }

    if (request.quantity < service.minQuantity) {
      throw new Error(
        `Quantity ${request.quantity} is below minimum ${service.minQuantity}`
      );
    }

    if (request.quantity > service.maxQuantity) {
      throw new Error(
        `Quantity ${request.quantity} exceeds maximum ${service.maxQuantity}`
      );
    }

    const externalOrderId = generateMockOrderId();
    const startCount = Math.floor(Math.random() * 10000);
    const charge = (request.quantity / 1000) * service.ratePerThousand;

    mockOrderStore.set(externalOrderId, {
      status: "pending",
      startCount,
      currentCount: startCount,
      quantity: request.quantity,
      createdAt: Date.now(),
    });

    return {
      externalOrderId,
      status: "pending",
      startCount,
      charge: parseFloat(charge.toFixed(2)),
    };
  }

  async getOrderStatus(
    externalOrderId: string
  ): Promise<ProviderOrderStatusResult> {
    await sleep(150);

    const order = mockOrderStore.get(externalOrderId);
    if (!order) {
      return {
        externalOrderId,
        status: "failed",
      };
    }

    const { status, currentCount, remains } =
      simulateOrderProgress(externalOrderId);

    // Update in-memory store
    mockOrderStore.set(externalOrderId, { ...order, status, currentCount });

    return {
      externalOrderId,
      status,
      startCount: order.startCount,
      currentCount,
      remains,
    };
  }

  async cancelOrder(externalOrderId: string): Promise<boolean> {
    await sleep(100);

    const order = mockOrderStore.get(externalOrderId);
    if (!order) return false;

    const ageMs = Date.now() - order.createdAt;
    // Can only cancel within first 5 minutes
    if (ageMs < 5 * 60 * 1000 && order.status === "pending") {
      mockOrderStore.set(externalOrderId, { ...order, status: "cancelled" });
      return true;
    }

    return false;
  }

  async ping(): Promise<boolean> {
    await sleep(50);
    return true;
  }
}
