"use client";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constant";

import { useQuery } from "@tanstack/react-query";
import { getPlotsAPI, getPlotAPI } from "./plot.api";
import type { PlotFilters } from "./plot.req";
export const plotQueryKeys = {
  plots: (filters?: PlotFilters) => [QUERY_KEYS.PLOTS, filters ?? {}] as const,
  plot: (id: string) => [QUERY_KEYS.PLOTS, id] as const,
};

export const usePlotsQuery = (filters?: PlotFilters) => useQuery({ queryKey: plotQueryKeys.plots(filters), queryFn: () => getPlotsAPI(filters) });

export const usePlotQuery = (id: string) => useQuery({ queryKey: plotQueryKeys.plot(id), queryFn: () => getPlotAPI(id), enabled: Boolean(id) });
