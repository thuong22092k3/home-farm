import { apiClient } from "../apiClient";
import { type BasePaginationRequest, type BasePaginationResponse } from "../types/base.type";
import { ENDPOINTS } from "@/lib/constants/endpoints.constant";
import type { Farm, FarmDetail } from "./farm.res";
import type { FarmFilters } from "./farm.req";

export const getFarmsAPI = (params?: Partial<BasePaginationRequest<FarmFilters>>): Promise<BasePaginationResponse<Farm[]>> =>
  apiClient.get(ENDPOINTS.FARMS.BASE, { params: params });

export const getFarmAPI = (id: string): Promise<FarmDetail> =>
  apiClient.get(`${ENDPOINTS.FARMS.BASE}/${id}`);
