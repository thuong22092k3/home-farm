import { apiClient } from "../apiClient";
import { type BasePaginationRequest, type BasePaginationResponse } from "../types/base.type";
import { ENDPOINTS } from "@/lib/constants/endpoints.constant";
import type { Notification } from "./notification.res";
import type { NotificationFilters } from "./notification.req";

export const getNotificationsAPI = (params?: Partial<BasePaginationRequest<NotificationFilters>>): Promise<BasePaginationResponse<Notification[]>> =>
  apiClient.get(ENDPOINTS.NOTIFICATIONS.BASE, { params: params });

export const readNotificationAPI = (id: string): Promise<Notification> =>
  apiClient.patch(`${ENDPOINTS.NOTIFICATIONS.BASE}/${id}/read`);
