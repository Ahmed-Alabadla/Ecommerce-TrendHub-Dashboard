import { Metadata } from "next";
import CategoriesClient from "./CategoriesClient";
import { queryClient } from "@/lib/react-query/client";
import { getCategories } from "@/actions/categories";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "Categories",
  description: "Manage categories in the system",
};

export default async function CategoriesPage() {
  // Prefetch with consistent query key structure
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60, // 1h
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)} key={"categories"}>
      <CategoriesClient />
    </HydrationBoundary>
  );
}
