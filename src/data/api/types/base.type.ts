export interface BaseResponse<T> {
  success: boolean;
  code: number;
  errorCode?: string;
  messageCode?: string;
  message: string;
  detail?: string;
  data: T;
  timestamp: number;
  extra?: string;
}

export interface PaginatedResponse<T> extends BaseResponse<T> {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export type BasePaginationResponse<T = unknown, E = unknown> = {
  success: boolean;
  code: number;
  errorCode?: string | null;
  messageCode: string | null;
  message: string | null;
  detail?: string | null;
  data: T;
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  timestamp: number;
  extra?: E;
};

export type BasePaginationRequest<T> = T & {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
};

export type ApiEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};
