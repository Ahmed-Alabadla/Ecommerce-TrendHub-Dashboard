import { Metadata } from "next";
import { queryClient } from "@/lib/react-query/client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getCoupons } from "@/actions/coupons";
import CouponsClient from "./CouponsClient";

export const metadata: Metadata = {
  title: "Coupons",
  description: "Manage coupons in the system",
};

export default async function CouponsPage() {
  // Prefetch with consistent query key structure
  await queryClient.prefetchQuery({
    queryKey: ["coupons"],
    queryFn: getCoupons,
    // staleTime: 1000 * 60 * 60, // 1h
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)} key={"coupons"}>
      <CouponsClient />
    </HydrationBoundary>
  );
}
