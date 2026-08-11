// Public API for the provider layer
export { getProviderManager, ProviderManager } from "./provider-manager";
export { getProviderBySlug, listRegisteredProviders, isProviderRegistered } from "./registry";
export { ProviderError } from "./types";
export type {
  IProviderAdapter,
  ProviderBalanceResult,
  ProviderOrderRequest,
  ProviderOrderResult,
  ProviderOrderStatusResult,
  ProviderServiceResult,
  ProviderRegistryEntry,
} from "./types";
