import type { OrderStatus } from "@/types";

// ─── Provider Contract ─────────────────────────────────────────────────────
// Every provider must implement this interface. No provider-specific logic
// should exist anywhere outside this directory.

export interface IProviderAdapter {
  /** Unique slug identifying this provider (e.g. "mock", "provider-a") */
  readonly slug: string;

  /** Human-readable display name */
  readonly name: string;

  /**
   * Fetch the current balance on the provider account.
   */
  getBalance(): Promise<ProviderBalanceResult>;

  /**
   * Fetch the list of services available from this provider.
   */
  getServices(): Promise<ProviderServiceResult[]>;

  /**
   * Place a new order with the provider.
   */
  createOrder(request: ProviderOrderRequest): Promise<ProviderOrderResult>;

  /**
   * Fetch the status of an existing order.
   */
  getOrderStatus(externalOrderId: string): Promise<ProviderOrderStatusResult>;

  /**
   * Cancel an order if the provider supports it.
   * Returns false if cancellation is not supported or failed silently.
   */
  cancelOrder(externalOrderId: string): Promise<boolean>;

  /**
   * Health-check: returns true if the provider API is reachable.
   */
  ping(): Promise<boolean>;
}

// ─── Result Types ──────────────────────────────────────────────────────────

export interface ProviderBalanceResult {
  balance: number;
  currency: string;
}

export interface ProviderServiceResult {
  externalServiceId: string;
  name: string;
  category: string;
  /** Price per 1000 units in provider's currency */
  ratePerThousand: number;
  minQuantity: number;
  maxQuantity: number;
  description?: string;
  estimatedDeliveryHours?: number;
}

export interface ProviderOrderRequest {
  /** Provider's own service identifier */
  externalServiceId: string;
  link: string;
  quantity: number;
  /** Internal order ID for correlation */
  internalOrderId: string;
}

export interface ProviderOrderResult {
  externalOrderId: string;
  status: OrderStatus;
  startCount?: number;
  charge?: number;
}

export interface ProviderOrderStatusResult {
  externalOrderId: string;
  status: OrderStatus;
  startCount?: number;
  currentCount?: number;
  remains?: number;
}

// ─── Provider Registry Entry ────────────────────────────────────────────────

export interface ProviderRegistryEntry {
  slug: string;
  name: string;
  factory: () => IProviderAdapter;
}

// ─── Provider Error ─────────────────────────────────────────────────────────

export class ProviderError extends Error {
  constructor(
    public readonly providerSlug: string,
    message: string,
    public readonly code?: string
  ) {
    super(`[${providerSlug}] ${message}`);
    this.name = "ProviderError";
  }
}
