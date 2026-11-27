import { apiClient } from "../apiClient";
import { type BasePaginationRequest, type BasePaginationResponse } from "../types/base.type";
import { ENDPOINTS } from "@/lib/constants/endpoints.constant";
import type { Livestream } from "./livestream.res";
import type { LivestreamFilters } from "./livestream.req";

export const getLivestreamsAPI = (params?: Partial<BasePaginationRequest<LivestreamFilters>>): Promise<BasePaginationResponse<Livestream[]>> =>
  apiClient.get(ENDPOINTS.LIVESTREAMS.BASE, { params: params });
