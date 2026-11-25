import { apiClient } from "../apiClient";
import { ENDPOINTS } from "@/lib/constants/endpoints.constant";
import type { Plan } from "./plan.res";

export const getPlansAPI = () => apiClient.get<unknown, Plan[]>(ENDPOINTS.PLANS.BASE);
