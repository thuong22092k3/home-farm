import { apiClient } from "../apiClient";
import { ENDPOINTS } from "@/lib/constants/endpoints.constant";
import type { PlotTimeline } from "./diary.res";

export const getPlotTimelineAPI = (plotId: string) => apiClient.get<unknown, PlotTimeline>(`${ENDPOINTS.PLOTS.BASE}/${plotId}/timeline`);
