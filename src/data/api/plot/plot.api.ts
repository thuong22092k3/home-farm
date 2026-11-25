import { apiClient } from "../apiClient";
import { ENDPOINTS } from "@/lib/constants/endpoints.constant";
import type { Plot } from "./plot.res";
import type { PlotFilters } from "./plot.req";

export const getPlotsAPI = (params?: PlotFilters) => apiClient.get<unknown, Plot[]>(ENDPOINTS.PLOTS.BASE, { params });

export const getPlotAPI = (id: string) => apiClient.get<unknown, Plot>(`${ENDPOINTS.PLOTS.BASE}/${id}`);
