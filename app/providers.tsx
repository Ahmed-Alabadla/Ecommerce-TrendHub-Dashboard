// In Next.js, this file would be called: app/providers.tsx
"use client";

import { queryClient } from "@/lib/react-query/client";
import { localStoragePersister } from "@/lib/react-query/persistor";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => queryClient);

  return (
    <PersistQueryClientProvider
      client={client}
      persistOptions={{
        persister: localStoragePersister, // Add these options to control persistence behavior
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        dehydrateOptions: {
          shouldDehydrateQuery: () => {
            // Only persist certain queries if needed
            return true;
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        {children}

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </PersistQueryClientProvider>
  );
}
