"use client";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constant";

import { useQuery } from "@tanstack/react-query";
import { getMarketListingsAPI } from "./marketplace.api";

export const marketplaceQueryKeys = {
  marketplace: [QUERY_KEYS.MARKETPLACE] as const,
};

export const useMarketListingsQuery = () => useQuery({ queryKey: marketplaceQueryKeys.marketplace, queryFn: () => getMarketListingsAPI({ status: "ACTIVE" }) });
