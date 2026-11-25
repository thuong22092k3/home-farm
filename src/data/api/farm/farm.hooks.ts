"use client";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constant";

import { useQuery } from "@tanstack/react-query";
import { getFarmsAPI } from "./farm.api";

export const farmQueryKeys = {
  farms: [QUERY_KEYS.FARMS] as const,
};

export const useFarmsQuery = () =>
  useQuery({ queryKey: farmQueryKeys.farms, queryFn: () => getFarmsAPI() });
