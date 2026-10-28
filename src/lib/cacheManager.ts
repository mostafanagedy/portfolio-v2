import { GitHubReposResponse } from "../types/github";
import { CertificatesResponse } from "../types/certificate";

interface CacheStore {
  data: GitHubReposResponse;
  timestamp: number;
}

interface CertificatesCacheStore {
  data: CertificatesResponse;
  timestamp: number;
}

// Configurable Cache Expiration: Defaults to 10 minutes (600 seconds)
export const CACHE_TTL_SECONDS =
  parseInt(process.env.REPOS_CACHE_TTL_SECONDS || "", 10) || 600;
export const CACHE_TTL_MS = CACHE_TTL_SECONDS * 1000;

let globalReposCache: CacheStore | null = null;
let globalCertificatesCache: CertificatesCacheStore | null = null;

// Track recent webhook deliveries to avoid duplicate processing (capped at 100 entries)
const recentWebhookDeliveries = new Set<string>();
const MAX_DELIVERY_HISTORY = 100;

/**
 * Retrieves currently cached repository data if still within TTL
 */
export function getCachedRepos(): {
  data: GitHubReposResponse;
  isStale: boolean;
} | null {
  if (!globalReposCache) return null;

  const now = Date.now();
  const ageMs = now - globalReposCache.timestamp;
  const isStale = ageMs >= CACHE_TTL_MS;

  return {
    data: globalReposCache.data,
    isStale,
  };
}

/**
 * Sets the global repositories cache
 */
export function setCachedRepos(data: GitHubReposResponse): void {
  globalReposCache = {
    data,
    timestamp: Date.now(),
  };
}

/**
 * Invalidates the server repository cache immediately (used by manual refresh & webhook)
 */
export function invalidateReposCache(reason?: string): void {
  if (reason) {
    console.log(`[CacheManager] Invaliding repos cache: ${reason}`);
  }
  globalReposCache = null;
}

/**
 * Checks if a webhook delivery has already been processed to prevent duplicates
 */
export function isDuplicateWebhook(deliveryId: string): boolean {
  if (!deliveryId) return false;
  return recentWebhookDeliveries.has(deliveryId);
}

/**
 * Records a webhook delivery ID
 */
export function recordWebhookDelivery(deliveryId: string): void {
  if (!deliveryId) return;

  if (recentWebhookDeliveries.size >= MAX_DELIVERY_HISTORY) {
    // Evict oldest entry
    const first = recentWebhookDeliveries.values().next().value;
    if (first) recentWebhookDeliveries.delete(first);
  }

  recentWebhookDeliveries.add(deliveryId);
}

/**
 * Diagnostic cache status
 */
export function getCacheStatus() {
  const now = Date.now();
  if (!globalReposCache) {
    return {
      hasCache: false,
      ageSeconds: 0,
      ttlSeconds: CACHE_TTL_SECONDS,
      isExpired: true,
    };
  }

  const ageSeconds = Math.floor((now - globalReposCache.timestamp) / 1000);
  return {
    hasCache: true,
    ageSeconds,
    ttlSeconds: CACHE_TTL_SECONDS,
    isExpired: ageSeconds >= CACHE_TTL_SECONDS,
  };
}

/**
 * Retrieves currently cached certificates data if still within TTL
 */
export function getCachedCertificates(): {
  data: CertificatesResponse;
  isStale: boolean;
} | null {
  if (!globalCertificatesCache) return null;

  const now = Date.now();
  const ageMs = now - globalCertificatesCache.timestamp;
  const isStale = ageMs >= CACHE_TTL_MS;

  return {
    data: globalCertificatesCache.data,
    isStale,
  };
}

/**
 * Sets the global certificates cache
 */
export function setCachedCertificates(data: CertificatesResponse): void {
  globalCertificatesCache = {
    data,
    timestamp: Date.now(),
  };
}

/**
 * Invalidates the certificates cache immediately (used by manual refresh)
 */
export function invalidateCertificatesCache(reason?: string): void {
  if (reason) {
    console.log(`[CacheManager] Invalidating certificates cache: ${reason}`);
  }
  globalCertificatesCache = null;
}

