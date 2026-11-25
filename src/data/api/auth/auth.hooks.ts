"use client";

import { useMutation } from "@tanstack/react-query";
import { createCustomerSession } from "./auth.api";

export function useCustomerSession() {
  return useMutation({ retry: false, mutationFn: createCustomerSession });
}
