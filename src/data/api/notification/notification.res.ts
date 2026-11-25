import type { ApiEntity } from "../types/base.type";

export type Notification = ApiEntity & {
  userId: string;
  type: string;
  title: string;
  data: Record<string, string>;
  readAt: string | null;
};
