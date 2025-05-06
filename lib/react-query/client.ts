// lib/react-query/client.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute stale time
      refetchOnWindowFocus: false, // Better for UX with Suspense
      refetchOnMount: false, // Let Suspense handle it
      refetchOnReconnect: true,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});
