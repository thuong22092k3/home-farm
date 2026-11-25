import type { ApiEntity } from "../types/base.type";

export type PlotStatus = "AVAILABLE" | "RESERVED" | "ADOPTED" | string;

export type Plot = ApiEntity & {
  farmId: string;
  cropType: string;
  season: string;
  price: number;
  status: PlotStatus;
  expectedHarvestAt: string;
  customerId?: string | null;
};
