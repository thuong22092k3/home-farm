"use client";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constant";

import { useQuery } from "@tanstack/react-query";
import { getPlotTimelineAPI } from "./diary.api";

export const diaryQueryKeys = {
  timeline: (plotId: string) => [QUERY_KEYS.PLOTS, plotId, "timeline"] as const,
};

export const usePlotTimelineQuery = (plotId: string) =>
  useQuery({
    queryKey: diaryQueryKeys.timeline(plotId),
    queryFn: () => getPlotTimelineAPI(plotId),
    enabled: Boolean(plotId),
  });
