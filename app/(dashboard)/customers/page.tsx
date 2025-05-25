import { Metadata } from "next";
import { queryClient } from "@/lib/react-query/client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import Loading from "@/app/loading";
import CustomersClient from "./CustomersClient";
import { getCustomers } from "@/actions/users";

export const metadata: Metadata = {
  title: "Customers",
  description: "Manage customers in the system",
};

export default async function CustomersPage() {
  // Prefetch with consistent query key structure
  await queryClient.prefetchQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  return (
    <Suspense fallback={<Loading />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CustomersClient />
      </HydrationBoundary>
    </Suspense>
  );
}
