import { Metadata } from "next";
import { queryClient } from "@/lib/react-query/client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import SubCategoriesClient from "./SubCategoriesClient";
import { getSubCategories } from "@/actions/subcategories";

export const metadata: Metadata = {
  title: "Sub Categories",
  description: "Manage sub-categories in the system",
};

export default async function SubCategoriesPage() {
  // Prefetch with consistent query key structure
  await queryClient.prefetchQuery({
    queryKey: ["subcategories"],
    queryFn: getSubCategories,
    // staleTime: 1000 * 60 * 60, // 1h
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)} key={"subcategories"}>
      <SubCategoriesClient />
    </HydrationBoundary>
  );
}
