import type { ApiEntity } from "../types/base.type";

import type { Plot } from "../plot/plot.res";

export type Diary = ApiEntity & {
  farmerId: string;
  plotId: string;
  activityType: string;
  title?: string;
  description?: string;
  mediaUrls: string[];
  occurredAt: string;
  growthStage?: string;
};

export type IotReading = ApiEntity & {
  plotId: string;
  temperature: number;
  soilMoisture: number;
  lightHours?: number;
  measuredAt: string;
};

export type PlotTimeline = {
  plot: Plot;
  diaries: Diary[];
  iotReadings: IotReading[];
};
