/**
 * Provider Registry
 *
 * Central registry for all provider adapters.
 * To add a new provider:
 *   1. Create a class implementing IProviderAdapter in ./providers/<name>/
 *   2. Register it here
 *   3. Set ACTIVE_PROVIDER=<slug> in your environment
 *
 * That's it. No other files need to change.
 */

import type { IProviderAdapter, ProviderRegistryEntry } from "./types";
import { MockProvider } from "./mock/mock-provider";

const registry: Map<string, ProviderRegistryEntry> = new Map();

/**
 * Register a provider adapter factory.
 * Using a factory (instead of an instance) allows lazy instantiation
 * and ensures each call gets a fresh instance if needed.
 */
function registerProvider(entry: ProviderRegistryEntry): void {
  registry.set(entry.slug, entry);
}

// ─── Built-in Providers ─────────────────────────────────────────────────────

registerProvider({
  slug: "mock",
  name: "Mock Provider",
  factory: () => new MockProvider(),
});

// To add Provider A in the future:
// registerProvider({
//   slug: "provider-a",
//   name: "Provider A",
//   factory: () => new ProviderAAdapter({ apiKey: process.env.PROVIDER_A_API_KEY! }),
// });

// ─── Registry API ───────────────────────────────────────────────────────────

export function getProviderBySlug(slug: string): IProviderAdapter {
  const entry = registry.get(slug);
  if (!entry) {
    throw new Error(
      `Provider "${slug}" is not registered. ` +
        `Available providers: ${Array.from(registry.keys()).join(", ")}`
    );
  }
  return entry.factory();
}

export function listRegisteredProviders(): ProviderRegistryEntry[] {
  return Array.from(registry.values());
}

export function isProviderRegistered(slug: string): boolean {
  return registry.has(slug);
}
