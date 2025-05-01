import { Metadata } from "next";
import { queryClient } from "@/lib/react-query/client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getReviews } from "@/actions/reviews";
import ReviewsClient from "./ReviewsClient";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Manage reviews in the system",
};

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { page = "1", limit = "10" } = await searchParams;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  queryClient.removeQueries({
    queryKey: ["reviews"],
    exact: false,
  });

  // Prefetch with consistent query key structure
  await queryClient.prefetchQuery({
    queryKey: ["reviews", { page: pageNumber, limit: limitNumber }],
    queryFn: () => getReviews({ page: pageNumber, limit: limitNumber }),
    staleTime: 0,
  });

  return (
    <HydrationBoundary
      state={dehydrate(queryClient)}
      key={`reviews-${pageNumber}-${limitNumber}`}
    >
      <ReviewsClient searchParams={{ page: pageNumber, limit: limitNumber }} />
    </HydrationBoundary>
  );
}
