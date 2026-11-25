"use client";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constant";

import { useQuery, useMutation } from "@tanstack/react-query";
import { createOrderAPI, getOrdersAPI, cancelOrderAPI } from "./order.api";
import type { CreateOrderRequest } from "./order.req";
export const orderQueryKeys = {
  orders: (customerId?: string) => [QUERY_KEYS.ORDERS, { customerId }] as const,
};

export const useOrdersQuery = (customerId?: string) => useQuery({ queryKey: orderQueryKeys.orders(customerId), queryFn: () => getOrdersAPI({ customerId }), enabled: Boolean(customerId) });

export const useCreateOrderMutation = () => useMutation({
  mutationFn: (data: CreateOrderRequest) => createOrderAPI(data),
  meta: {
    invalidatesQueries: [[QUERY_KEYS.ORDERS], [QUERY_KEYS.PLOTS]],
    successMessage: "Đã tạo đơn nhận nuôi cây.",
    errorMessage: "Không thể tạo đơn. Vui lòng thử lại.",
  },
});

export const useCancelOrderMutation = () => useMutation({
  mutationFn: ({ id, reason }: { id: string; reason: string }) => cancelOrderAPI(id, reason),
  meta: { invalidatesQueries: [[QUERY_KEYS.ORDERS], [QUERY_KEYS.PLOTS]] },
});
