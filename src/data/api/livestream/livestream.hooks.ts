"use client";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constant";

import { useQuery } from "@tanstack/react-query";
import { getLivestreamsAPI } from "./livestream.api";

export const livestreamQueryKeys = {
  livestreams: [QUERY_KEYS.LIVESTREAMS] as const,
};

export const useLivestreamsQuery = () => useQuery({ queryKey: livestreamQueryKeys.livestreams, queryFn: () => getLivestreamsAPI() });
