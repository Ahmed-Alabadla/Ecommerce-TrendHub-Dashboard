import { Metadata } from "next";
import { queryClient } from "@/lib/react-query/client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import SuppliersClient from "./SuppliersClient";
import { getSuppliers } from "@/actions/suppliers";

export const metadata: Metadata = {
  title: "Suppliers",
  description: "Manage suppliers in the system",
};

export default async function SuppliersPage() {
  // Prefetch with consistent query key structure
  await queryClient.prefetchQuery({
    queryKey: ["suppliers"],
    queryFn: getSuppliers,
    // staleTime: 1000 * 60 * 60, // 1h
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)} key={"suppliers"}>
      <SuppliersClient />
    </HydrationBoundary>
  );
}
