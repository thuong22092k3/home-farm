import type { ApiEntity } from "../types/base.type";

export type MarketListing = ApiEntity & {
  sellerId: string;
  title: string;
  description?: string;
  quantity: number;
  price?: number;
  mode: string;
  status: string;
  imageUrl?: string;
};
