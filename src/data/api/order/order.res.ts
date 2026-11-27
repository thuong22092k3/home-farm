import type { ApiEntity } from "../types/base.type";

export type Order = ApiEntity & {
  customerId: string;
  plotId: string;
  planId: string;
  fulfillmentMethod: "HOME_DELIVERY" | "FARM_PICKUP";
  shippingAddress?: string;
  recipientName?: string;
  recipientPhone?: string;
  total: number;
  status: string;
  paymentExpiresAt?: number;
  paymentStatus?: string;
  harvestDate: string;
};
