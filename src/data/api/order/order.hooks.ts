"use client";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constant";

import { useQuery, useMutation } from "@tanstack/react-query";
import { createOrderAPI, getOrderAPI, getOrdersAPI, cancelOrderAPI } from "./order.api";
import type { CreateOrderRequest } from "./order.req";
export const orderQueryKeys = {
  orders: (customerId?: string) => [QUERY_KEYS.ORDERS, { customerId }] as const,
};

export const useOrdersQuery = (customerId?: string) =>
  useQuery({
    queryKey: orderQueryKeys.orders(customerId),
    queryFn: () => getOrdersAPI({ customerId }),
    enabled: Boolean(customerId),
    refetchOnWindowFocus: "always",
    refetchInterval: (query) =>
      query.state.data?.data?.some((order) => order.status === "PENDING_PAYMENT")
        ? 5_000
        : false,
  });

export const useCreateOrderMutation = () => useMutation({
  retry: false,
  mutationFn: (data: CreateOrderRequest) => createOrderAPI(data),
  meta: {
    invalidatesQueries: [[QUERY_KEYS.ORDERS], [QUERY_KEYS.PLOTS]],
    successMessage: "Đã tạo đơn nhận nuôi cây.",
    errorMessage: "Không thể tạo đơn. Vui lòng thử lại.",
  },
});

export function useOrderQuery(orderId: string, customerId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, "detail", customerId, orderId],
    queryFn: () => getOrderAPI(orderId),
    enabled: Boolean(orderId && customerId),
    refetchOnWindowFocus: "always",
    refetchOnMount: "always",
    retry: false,
  });
}

export const useCancelOrderMutation = () => useMutation({
  mutationFn: ({ id, reason }: { id: string; reason: string }) => cancelOrderAPI(id, reason),
  meta: { invalidatesQueries: [[QUERY_KEYS.ORDERS], [QUERY_KEYS.PLOTS]] },
});
