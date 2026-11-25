import { toast } from "sonner";
import { getApiErrorMessage } from "./apiClient";
import { AppNotification } from "@/components/app-notification/app-notification";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  type QueryKey,
} from "@tanstack/react-query";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidatesQuery?: QueryKey;
      invalidatesQueries?: QueryKey[];
      successMessage?: string;
      errorMessage?: string;
    };
  }
}

function errorMessage(error: unknown) {
  const message = getApiErrorMessage(error, "Không thể hoàn tất yêu cầu. Vui lòng thử lại.");
  if (message === "Invalid credentials") return "Email hoặc mật khẩu không đúng.";
  if (message === "Network Error") return "Không thể kết nối máy chủ. Vui lòng thử lại.";
  return message;
}
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => toast.error(errorMessage(error), { id: query.queryHash }),
  }),
  mutationCache: new MutationCache({
    onSuccess(_data, _variables, _onMutateResult, mutation, _context) {
      if (mutation.meta?.successMessage) {
        AppNotification.success(mutation.meta.successMessage);
      }
    },
    onError(error, _variables, _onMutateResult, mutation) {
      toast.error(mutation.meta?.errorMessage ?? errorMessage(error));
    },
    async onSettled(_data, _error, _variables, _onMutateResult, mutation, _context) {
      if (mutation.meta?.invalidatesQuery) {
        await queryClient.invalidateQueries({
          queryKey: mutation.meta.invalidatesQuery,
        });
      }
      if (mutation.meta?.invalidatesQueries) {
        await Promise.all(
          mutation.meta.invalidatesQueries.map((queryKey) =>
            queryClient.invalidateQueries({ queryKey }),
          ),
        );
      }
    },
  }),
});
