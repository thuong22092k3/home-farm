"use client";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constant";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getNotificationsAPI, readNotificationAPI } from "./notification.api";

export const notificationQueryKeys = {
  notifications: (userId?: string) => [QUERY_KEYS.NOTIFICATIONS, { userId }] as const,
};

export const useNotificationsQuery = (userId?: string) => useQuery({ queryKey: notificationQueryKeys.notifications(userId), queryFn: () => getNotificationsAPI({ userId }), enabled: Boolean(userId) });

export const useReadNotificationMutation = () => useMutation({
  mutationFn: readNotificationAPI,
  meta: { invalidatesQuery: [QUERY_KEYS.NOTIFICATIONS] },
});
