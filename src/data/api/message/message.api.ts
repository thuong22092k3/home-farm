import { ENDPOINTS } from "@/lib/constants/endpoints.constant";
import { apiClient } from "../apiClient";

export const sendGardenMessageAPI = (data: {
  senderId: string;
  recipientId: string;
  content: string;
}): Promise<{ id: string }> => apiClient.post(ENDPOINTS.MESSAGES.BASE, data);
