"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { columns } from "./columns";

import { toast } from "sonner";
import { ReviewQueryParams } from "@/types/review";
import { useSuspenseQuery } from "@tanstack/react-query";
import { apiGetReviews } from "@/lib/api/review";
import DataTablePaginate from "@/components/shared/dashboard/table/DataTablePaginate";
import PaginationTable from "@/components/shared/dashboard/table/PaginationTable";

export default function ReviewsClient({
  searchParams,
}: {
  searchParams: ReviewQueryParams;
}) {
  const { page = "1", limit = "10" } = searchParams;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const { data, isLoading, isError, error } = useSuspenseQuery({
    queryKey: ["reviews", { page: pageNumber, limit: limitNumber }],
    queryFn: () => apiGetReviews({ page: pageNumber, limit: limitNumber }),
    staleTime: 0, // Always stale to force refetch
  });

  if (isError) {
    toast.error(error?.message as string, {
      description: "Failed to fetch reviews",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
          <p className="text-muted-foreground">
            Manage customer product reviews and feedback
          </p>
        </div>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Reviews</CardTitle>
          <CardDescription>Showing {data.data.length} reviews</CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO: filter by product */}
          <DataTablePaginate
            columns={columns}
            data={data.data}
            loading={isLoading}
            currentPage={data.meta.current_page}
            totalItems={data.meta.total}
            itemsPerPage={data.meta.per_page}
          />

          <PaginationTable
            currentPage={data.meta.current_page}
            totalItems={data.meta.total}
            itemsPerPage={data.meta.per_page}
            lastPage={data.meta.last_page}
            className="mt-6"
          />
        </CardContent>
      </Card>
    </div>
  );
}
