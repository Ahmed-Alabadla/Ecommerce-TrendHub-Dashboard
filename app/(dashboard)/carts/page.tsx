import { Metadata } from "next";
import { queryClient } from "@/lib/react-query/client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getCarts } from "@/actions/carts";
import CartsClient from "./CartsClient";

export const metadata: Metadata = {
  title: "Carts",
  description: "Manage carts in the system",
};

export default async function CartsPage() {
  // Prefetch with consistent query key structure
  await queryClient.prefetchQuery({
    queryKey: ["carts"],
    queryFn: getCarts,
    // staleTime: 1000 * 60 * 60, // 1h
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CartsClient />
    </HydrationBoundary>
  );
}
