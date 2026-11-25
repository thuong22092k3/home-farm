import { apiClient } from "../apiClient";
import { ENDPOINTS } from "@/lib/constants/endpoints.constant";
import type { CustomerCredentials } from "./auth.req";
import type { CustomerSession } from "./auth.res";

export function createCustomerSession(credentials: CustomerCredentials) {
  const endpoint =
    credentials.name === undefined
      ? ENDPOINTS.AUTH.LOGIN
      : ENDPOINTS.AUTH.REGISTER;
  return apiClient.post<unknown, CustomerSession>(endpoint, credentials);
}
