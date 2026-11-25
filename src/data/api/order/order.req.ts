export type OrderFilters = Record<string, string | number | undefined>;

import type { Order } from "./order.res";

export type CreateOrderRequest = Pick<
  Order,
  "customerId" | "plotId" | "planId" | "fulfillmentMethod"
> &
  Partial<Pick<Order, "shippingAddress" | "recipientName" | "recipientPhone">>;
