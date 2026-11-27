import { apiClient } from "../apiClient";
import { type BasePaginationRequest, type BasePaginationResponse } from "../types/base.type";
import { ENDPOINTS } from "@/lib/constants/endpoints.constant";
import type { Plan } from "./plan.res";

export const getPlansAPI = (params?: Partial<BasePaginationRequest<object>>): Promise<BasePaginationResponse<Plan[]>> =>
  apiClient.get(ENDPOINTS.PLANS.BASE, { params: params });
