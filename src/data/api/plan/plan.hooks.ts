"use client";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constant";

import { useQuery } from "@tanstack/react-query";
import { getPlansAPI } from "./plan.api";

export const planQueryKeys = {
  plans: [QUERY_KEYS.PLANS] as const,
};

export const usePlansQuery = () => useQuery({ queryKey: planQueryKeys.plans, queryFn: getPlansAPI });
