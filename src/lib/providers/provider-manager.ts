/**
 * ProviderManager
 *
 * The single point of contact between application business logic and the
 * provider ecosystem. All order creation, status checks, and service syncs
 * go through here. The manager handles:
 *
 *   - Selecting the active provider (from config or DB)
 *   - Routing to the correct adapter
 *   - Error normalisation
 *   - Retry logic for transient failures
 *   - Future: load-balancing, fallback providers, per-service routing
 */

import { getProviderBySlug } from "./registry";
import { ProviderError } from "./types";
import type {
  IProviderAdapter,
  ProviderBalanceResult,
  ProviderOrderRequest,
  ProviderOrderResult,
  ProviderOrderStatusResult,
  ProviderServiceResult,
} from "./types";
import { sleep } from "@/lib/utils";

const ACTIVE_PROVIDER_SLUG =
  process.env.ACTIVE_PROVIDER ?? "mock";

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 500;

async function withRetry<T>(
  fn: () => Promise<T>,
  providerSlug: string,
  maxRetries = MAX_RETRIES
): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxRetries) {
        await sleep(RETRY_DELAY_MS * (attempt + 1));
      }
    }
  }
  throw new ProviderError(
    providerSlug,
    lastError?.message ?? "Unknown error",
    "MAX_RETRIES_EXCEEDED"
  );
}

export class ProviderManager {
  private readonly provider: IProviderAdapter;

  constructor(providerSlug: string = ACTIVE_PROVIDER_SLUG) {
    this.provider = getProviderBySlug(providerSlug);
  }

  get activeProviderSlug(): string {
    return this.provider.slug;
  }

  get activeProviderName(): string {
    return this.provider.name;
  }

  // ─── Balance ──────────────────────────────────────────────────────────────

  async getBalance(): Promise<ProviderBalanceResult> {
    return withRetry(
      () => this.provider.getBalance(),
      this.provider.slug
    );
  }

  // ─── Services ─────────────────────────────────────────────────────────────

  async getServices(): Promise<ProviderServiceResult[]> {
    return withRetry(
      () => this.provider.getServices(),
      this.provider.slug
    );
  }

  // ─── Orders ───────────────────────────────────────────────────────────────

  async createOrder(
    request: ProviderOrderRequest
  ): Promise<ProviderOrderResult> {
    return withRetry(
      () => this.provider.createOrder(request),
      this.provider.slug
    );
  }

  async getOrderStatus(
    externalOrderId: string
  ): Promise<ProviderOrderStatusResult> {
    return withRetry(
      () => this.provider.getOrderStatus(externalOrderId),
      this.provider.slug
    );
  }

  async cancelOrder(externalOrderId: string): Promise<boolean> {
    return withRetry(
      () => this.provider.cancelOrder(externalOrderId),
      this.provider.slug
    );
  }

  // ─── Health ───────────────────────────────────────────────────────────────

  async ping(): Promise<boolean> {
    try {
      return await this.provider.ping();
    } catch {
      return false;
    }
  }
}

/**
 * Singleton instance using the configured active provider.
 * Import this anywhere in the app to interact with providers.
 */
let _providerManagerInstance: ProviderManager | null = null;

export function getProviderManager(): ProviderManager {
  if (!_providerManagerInstance) {
    _providerManagerInstance = new ProviderManager(ACTIVE_PROVIDER_SLUG);
  }
  return _providerManagerInstance;
}
