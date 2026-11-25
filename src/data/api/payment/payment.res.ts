import type { ApiEntity } from "../types/base.type";

export type PaymentIntent = ApiEntity & {
  orderId: string;
  customerId: string;
  provider: string;
  amount: number;
  status: string;
  checkoutUrl: string;
};
