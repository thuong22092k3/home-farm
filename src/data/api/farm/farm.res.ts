import type { ApiEntity } from "../types/base.type";

import type { Plot } from "../plot/plot.res";

export type Farm = ApiEntity & {
  name: string;
  region: string;
  certifications: string[];
  farmerId: string;
  latitude?: number;
  longitude?: number;
};

export type FarmDetail = Farm & { plots: Plot[] };
