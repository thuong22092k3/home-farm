import type { ApiEntity } from "../types/base.type";

export type Livestream = ApiEntity & {
  farmerId: string;
  farmId: string;
  title: string;
  streamUrl: string;
  status: string;
  plotIds: string[];
  viewerCount: number;
  offers?: Array<Record<string, unknown>>;
};
