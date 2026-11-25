import type { ApiEntity } from "../types/base.type";

export type Plan = ApiEntity & {
  name: string;
  type: string;
  durationMonths: number;
  priceMultiplier: number;
  minimumYieldKg?: number;
  includesCertificate?: boolean;
  includesFarmVisit?: boolean;
};
