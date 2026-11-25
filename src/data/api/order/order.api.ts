import { apiClient } from "../apiClient";
import { ENDPOINTS } from "@/lib/constants/endpoints.constant";
import type { Order } from "./order.res";
import type { OrderFilters, CreateOrderRequest } from "./order.req";

export const createOrderAPI = (data: CreateOrderRequest) => apiClient.post<unknown, Order>(ENDPOINTS.ORDERS.BASE, data);

export const getOrdersAPI = (params?: OrderFilters) => apiClient.get<unknown, Order[]>(ENDPOINTS.ORDERS.BASE, { params });

export const cancelOrderAPI = (id: string, reason: string) => apiClient.patch<unknown, Order>(`${ENDPOINTS.ORDERS.BASE}/${id}/cancel`, { reason });
