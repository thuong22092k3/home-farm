import { apiClient } from "../apiClient";
import { ENDPOINTS } from "@/lib/constants/endpoints.constant";
import type { Notification } from "./notification.res";
import type { NotificationFilters } from "./notification.req";

export const getNotificationsAPI = (params?: NotificationFilters) => apiClient.get<unknown, Notification[]>(ENDPOINTS.NOTIFICATIONS.BASE, { params });

export const readNotificationAPI = (id: string) => apiClient.patch<unknown, Notification>(`${ENDPOINTS.NOTIFICATIONS.BASE}/${id}/read`);
