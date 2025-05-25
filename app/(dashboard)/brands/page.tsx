import { Metadata } from "next";
import BrandsClient from "./BrandsClient";
import { queryClient } from "@/lib/react-query/client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getBrands } from "@/actions/brands";
import { Suspense } from "react";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: "Brands",
  description: "Manage brands in the system",
};

export default async function BrandsPage() {
  // Prefetch with consistent query key structure
  await queryClient.prefetchQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
    // staleTime: 1000 * 60 * 60, // 1h
  });

  return (
    <Suspense fallback={<Loading />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BrandsClient />
      </HydrationBoundary>
    </Suspense>
  );
}
