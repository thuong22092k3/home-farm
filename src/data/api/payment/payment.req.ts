export type PaymentProvider = "VNPAY" | "MOBILE_BANKING" | "MOMO";

export type CreatePaymentIntentRequest = { orderId: string; provider: PaymentProvider };
