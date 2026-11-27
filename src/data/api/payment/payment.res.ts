import type { PaymentProvider } from "./payment.req";

export type PaymentIntent = {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  amount: number;
  status: string;
  checkoutUrl: string;
  mode: "SANDBOX";
  expiresAt: number;
};
