import { Metadata } from "next";
import { queryClient } from "@/lib/react-query/client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getCustomers } from "@/actions/users";
import OrdersClient from "./OrdersClient";

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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrdersClient />
    </HydrationBoundary>
  );
}
