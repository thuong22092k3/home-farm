import type { QueryClient } from "@tanstack/react-query";

/**
 * Centralized query keys for TanStack Query cache management.
 *
 * Query keys uniquely identify cached data and enable:
 * - Cache identification and invalidation
 * - Data synchronization across components
 * - Performance optimization through query deduplication
 * - Targeted refetching after mutations
 */

export const QUERY_KEYS = {
  AUTH: "AUTH",
  USER: "USER",
} as const;

/**
 * Helper functions for common query key operations
 */
export const queryKeys = {
  // Helper to get all keys for a feature
  getAllForFeature: (feature: keyof typeof QUERY_KEYS) => {
    const keys = QUERY_KEYS[feature];
    if (typeof keys === "object" && !Array.isArray(keys)) {
      return Object.keys(keys);
    }
    return [];
  },

  // Helper to invalidate all queries for a feature
  invalidateFeature: (
    queryClient: QueryClient,
    feature: keyof typeof QUERY_KEYS,
  ) => {
    queryClient.invalidateQueries({
      queryKey: [feature],
      exact: false,
    });
  },

  // Helper to check if a query key matches a pattern
  matchesPattern: (
    queryKey: readonly string[],
    pattern: readonly string[],
  ): boolean => {
    return pattern.every((key, index) => queryKey[index] === key);
  },
};
