import { apiClient } from "../apiClient";
import { ENDPOINTS } from "@/lib/constants/endpoints.constant";
import type { PlotTimeline } from "./diary.res";

export const getPlotTimelineAPI = (plotId: string): Promise<PlotTimeline> =>
  apiClient.get(`${ENDPOINTS.PLOTS.BASE}/${plotId}/timeline`);
