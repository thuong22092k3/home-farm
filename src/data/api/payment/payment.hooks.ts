"use client";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constant";

import { useMutation } from "@tanstack/react-query";
import { createPaymentIntentAPI } from "./payment.api";


export const useCreatePaymentIntentMutation = () => useMutation({
  mutationFn: createPaymentIntentAPI,
  meta: { invalidatesQuery: [QUERY_KEYS.ORDERS] },
});
