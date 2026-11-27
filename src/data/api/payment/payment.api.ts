import { apiClient } from "../apiClient";
import { ENDPOINTS } from "@/lib/constants/endpoints.constant";
import type { PaymentIntent } from "./payment.res";
import type { CreatePaymentIntentRequest } from "./payment.req";

export const createPaymentIntentAPI = (data: CreatePaymentIntentRequest): Promise<PaymentIntent> =>
  apiClient.post(`${ENDPOINTS.PAYMENTS.BASE}/intents`, data);
