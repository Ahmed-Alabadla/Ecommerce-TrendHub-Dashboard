import { Metadata } from "next";
import { queryClient } from "@/lib/react-query/client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ProductsClient from "./ProductsClient";
import { getProducts } from "@/actions/products";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage products in the system",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { page = "1", limit = "10" } = await searchParams;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  // Clear any existing product queries
  queryClient.removeQueries({
    queryKey: ["products"],
    exact: false,
  });

  try {
    // Prefetch with consistent query key structure
    await queryClient.prefetchQuery({
      queryKey: ["products", { page: pageNumber, limit: limitNumber }],
      queryFn: () => getProducts({ page: pageNumber, limit: limitNumber }),
      staleTime: 60 * 1000, // 1 minute stale time
    });
  } catch (error) {
    console.error("Failed to prefetch products:", error);
    // Continue rendering even if prefetch fails - client will retry
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsClient searchParams={{ page: pageNumber, limit: limitNumber }} />
    </HydrationBoundary>
  );
}
