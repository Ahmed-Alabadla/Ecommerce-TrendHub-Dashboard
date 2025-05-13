import { Metadata } from "next";
import { queryClient } from "@/lib/react-query/client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getSettings } from "@/actions/settings";
import SettingsClient from "./SettingsClient";
import Loading from "@/app/loading";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage settings in the system",
};

export default async function SettingsPage() {
  await queryClient.prefetchQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
    staleTime: Infinity, // never becomes stale
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading />}>
        <SettingsClient />
      </Suspense>
    </HydrationBoundary>
  );
}
