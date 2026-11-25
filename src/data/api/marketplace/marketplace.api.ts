import { apiClient } from "../apiClient";
import { ENDPOINTS } from "@/lib/constants/endpoints.constant";
import type { MarketListing } from "./marketplace.res";
import type { MarketplaceFilters } from "./marketplace.req";

export const getMarketListingsAPI = (params?: MarketplaceFilters) => apiClient.get<unknown, MarketListing[]>(ENDPOINTS.MARKET_LISTINGS.BASE, { params });
