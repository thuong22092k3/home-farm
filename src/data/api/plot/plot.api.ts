import { apiClient } from "../apiClient";
import { type BasePaginationRequest, type BasePaginationResponse } from "../types/base.type";
import { ENDPOINTS } from "@/lib/constants/endpoints.constant";
import type { Plot } from "./plot.res";
import type { PlotFilters } from "./plot.req";

export const getPlotsAPI = (params?: Partial<BasePaginationRequest<PlotFilters>>): Promise<BasePaginationResponse<Plot[]>> =>
  apiClient.get(ENDPOINTS.PLOTS.BASE, { params: params });

export const getPlotAPI = (id: string): Promise<Plot> =>
  apiClient.get(`${ENDPOINTS.PLOTS.BASE}/${id}`);
