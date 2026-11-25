import { apiClient } from "../apiClient";
import { ENDPOINTS } from "@/lib/constants/endpoints.constant";
import type { Farm, FarmDetail } from "./farm.res";
import type { FarmFilters } from "./farm.req";

export const getFarmsAPI = (params?: FarmFilters) =>
  apiClient.get<unknown, Farm[]>(ENDPOINTS.FARMS.BASE, { params });

export const getFarmAPI = (id: string) =>
  apiClient.get<unknown, FarmDetail>(`${ENDPOINTS.FARMS.BASE}/${id}`);
