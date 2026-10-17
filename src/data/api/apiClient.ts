import { AUTH_TOKEN_KEYS } from "@/lib/constants/auth.constant";
import { ENDPOINTS } from "@/lib/constants/endpoints.constant";
import {
  deleteCookie,
  getCookie,
  setCookie,
} from "@/lib/helpers/cookie.helper";
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const ACCESS_TOKEN_KEY = AUTH_TOKEN_KEYS.ACCESS_TOKEN;
const REFRESH_TOKEN_KEY = AUTH_TOKEN_KEYS.REFRESH_TOKEN;
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.example.com";

type ApiErrorPayload = {
  success?: boolean;
  code?: number;
  errorCode?: string;
  messageCode?: string;
  message?: string;
  error?: string;
  detail?: string;
  timestamp?: number;
};

export type ApiErrorResponse = {
  success: false;
  code: number;
  errorCode: string;
  messageCode: string;
  message: string;
  detail: string;
  timestamp: number;
};

export const normalizeApiError = (error: unknown): ApiErrorResponse => {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const responseData = error.response?.data;
    return {
      success: false,
      code: responseData?.code ?? error.response?.status ?? 500,
      errorCode: responseData?.errorCode ?? "SYSTEM-500-000",
      messageCode: responseData?.messageCode ?? "error.system.unknown",
      message:
        responseData?.message ??
        responseData?.error ??
        error.message ??
        "Something went wrong. Please try again.",
      detail: responseData?.detail ?? error.config?.url ?? "",
      timestamp: responseData?.timestamp ?? Date.now(),
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      code: 500,
      errorCode: "SYSTEM-500-000",
      messageCode: "error.system.unknown",
      message: error.message || "Something went wrong. Please try again.",
      detail: "",
      timestamp: Date.now(),
    };
  }

  return {
    success: false,
    code: 500,
    errorCode: "SYSTEM-500-000",
    messageCode: "error.system.unknown",
    message: "Something went wrong. Please try again.",
    detail: "",
    timestamp: Date.now(),
  };
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: string }).message;
    if (message) return message;
  }

  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      fallback
    );
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: ApiErrorResponse) => void;
}> = [];

const processQueue = (
  error: ApiErrorResponse | null,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const clearAuthData = () => {
  deleteCookie(ACCESS_TOKEN_KEY);
  deleteCookie(REFRESH_TOKEN_KEY);
  localStorage.removeItem("auth_user");
};

apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isAuthEndpoint =
      originalRequest?.url?.includes(ENDPOINTS.AUTH.LOGIN) ||
      originalRequest?.url?.includes(ENDPOINTS.AUTH.REFRESH) ||
      originalRequest?.url?.includes(ENDPOINTS.AUTH.LOGOUT);

    if (
      error.response?.status === 403 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;
      return apiClient(originalRequest);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getCookie(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        clearAuthData();
        window.location.href = "/login";
        return Promise.reject(normalizeApiError(error));
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } },
        );

        const tokenData = response.data?.data;
        if (!tokenData?.accessToken) {
          throw new Error("Invalid refresh response");
        }
        const { accessToken, refreshToken: newRefreshToken } = tokenData;

        setCookie(ACCESS_TOKEN_KEY, accessToken);
        setCookie(REFRESH_TOKEN_KEY, newRefreshToken);

        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        const normalizedRefreshError = normalizeApiError(refreshError);
        processQueue(normalizedRefreshError, null);
        clearAuthData();
        window.location.href = "/login";
        return Promise.reject(normalizedRefreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);
