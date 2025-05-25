import { Metadata } from "next";
import { queryClient } from "@/lib/react-query/client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getCustomers } from "@/actions/users";
import OrdersClient from "./OrdersClient";
import { Suspense } from "react";
import Loading from "@/app/loading";

export const metadata: Metadata = {
  title: "Orders",
  description: "Manage orders in the system",
};

export default async function CartsPage() {
  // Prefetch with consistent query key structure
  await queryClient.prefetchQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
    // staleTime: 1000 * 60 * 60, // 1h
  });

  return (
    <Suspense fallback={<Loading />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <OrdersClient />
      </HydrationBoundary>
    </Suspense>
  );
}
