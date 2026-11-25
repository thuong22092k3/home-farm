import type { Farm } from "@/data/api/farm/farm.res";
import type { Plan } from "@/data/api/plan/plan.res";
import type { Plot } from "@/data/api/plot/plot.res";

const cropImages = [
  "/images/orchard-farmer.jpg",
  "/images/family-harvest.jpg",
  "/images/lychee-orchard.jpg",
] as const;

export const formatVnd = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);

export const getPlotImage = (plot: Plot) => {
  const hash = [...plot.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return cropImages[hash % cropImages.length];
};

export const getFarmName = (farms: Farm[] | undefined, farmId: string) =>
  farms?.find((farm) => farm.id === farmId)?.name ?? "Nhà vườn Vườn Nhà";

export const getPlanPrice = (plot: Plot | undefined, plan: Plan) =>
  Math.round((plot?.price ?? 0) * plan.priceMultiplier);
