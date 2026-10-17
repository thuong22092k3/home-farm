import { AppNotification } from "@/components/app-notification/app-notification";
import {
  MutationCache,
  QueryClient,
  type QueryKey,
} from "@tanstack/react-query";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidatesQuery?: QueryKey;
      successMessage?: string;
      errorMessage?: string;
    };
  }
}

// Create a client
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
  mutationCache: new MutationCache({
    onSuccess(_data, _variables, _onMutateResult, mutation, _context) {
      if (mutation.meta?.successMessage) {
        AppNotification.success(mutation.meta.successMessage);
      }
    },
    onError(_error, _variables, _onMutateResult, mutation, _context) {
      if (mutation.meta?.errorMessage) {
        AppNotification.error(mutation.meta.errorMessage);
      }
    },
    onSettled(_data, _error, _variables, _onMutateResult, mutation, _context) {
      if (mutation.meta?.invalidatesQuery) {
        queryClient.invalidateQueries({
          queryKey: mutation.meta?.invalidatesQuery,
        });
      }
    },
  }),
});
