import { apiClient } from "../apiClient";
import { ENDPOINTS } from "@/lib/constants/endpoints.constant";
import type { Livestream } from "./livestream.res";
import type { LivestreamFilters } from "./livestream.req";

export const getLivestreamsAPI = (params?: LivestreamFilters) => apiClient.get<unknown, Livestream[]>(ENDPOINTS.LIVESTREAMS.BASE, { params });
