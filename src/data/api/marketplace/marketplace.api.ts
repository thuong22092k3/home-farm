import { apiClient } from "../apiClient";
import { type BasePaginationRequest, type BasePaginationResponse } from "../types/base.type";
import { ENDPOINTS } from "@/lib/constants/endpoints.constant";
import type { MarketListing } from "./marketplace.res";
import type { MarketplaceFilters } from "./marketplace.req";

export const getMarketListingsAPI = (params?: Partial<BasePaginationRequest<MarketplaceFilters>>): Promise<BasePaginationResponse<MarketListing[]>> =>
  apiClient.get(ENDPOINTS.MARKET_LISTINGS.BASE, { params: params });
