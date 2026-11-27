import { apiClient } from "../apiClient";
import { type BasePaginationRequest, type BasePaginationResponse } from "../types/base.type";
import { ENDPOINTS } from "@/lib/constants/endpoints.constant";
import type { Order } from "./order.res";
import type { OrderFilters, CreateOrderRequest } from "./order.req";

export const createOrderAPI = (data: CreateOrderRequest): Promise<Order> =>
  apiClient.post(ENDPOINTS.ORDERS.BASE, data);

export const getOrdersAPI = (params?: Partial<BasePaginationRequest<OrderFilters>>): Promise<BasePaginationResponse<Order[]>> =>
  apiClient.get(ENDPOINTS.ORDERS.BASE, { params: params });

export const cancelOrderAPI = (id: string, reason: string): Promise<Order> =>
  apiClient.patch(`${ENDPOINTS.ORDERS.BASE}/${id}/cancel`, { reason });
