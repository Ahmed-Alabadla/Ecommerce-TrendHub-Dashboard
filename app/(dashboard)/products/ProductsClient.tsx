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
import { useQuery } from "@tanstack/react-query";
import DataTablePaginate from "@/components/shared/dashboard/table/DataTablePaginate";
import PaginationTable from "@/components/shared/dashboard/table/PaginationTable";
import { ProductQueryParams } from "@/types/product";
import { apiGetProducts } from "@/lib/api/product";
import Loading from "@/app/loading";
import { DialogWrapper } from "@/components/shared/dashboard/DialogWrapper";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProductForm from "@/components/shared/dashboard/ProductForm";

export default function ProductsClient({
  searchParams,
}: {
  searchParams: ProductQueryParams;
}) {
  const { page = "1", limit = "10" } = searchParams;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["products", { page: pageNumber, limit: limitNumber }],
    queryFn: () => apiGetProducts({ page: pageNumber, limit: limitNumber }),
    staleTime: 60 * 1000, // 1 minute stale time
    retry: 2, // Retry twice before failing
    retryDelay: 1000, // 1 second between retries
  });

  console.log("Products data:", data);

  if (isError) {
    toast.error("Failed to fetch products", {
      description: error?.message || "Please try again later",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>

        <DialogWrapper
          title="Create New Product"
          description="Fill in the details below to add a new product to your inventory."
          size="2xl"
          dialogTrigger={
            <Button variant="default">
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </Button>
          }
        >
          <ProductForm type="create" />
        </DialogWrapper>
      </div>
      {(isLoading || isFetching) && (
        <div className="flex items-center justify-center h-96">
          <Loading />
        </div>
      )}
      {data && !isLoading && !isFetching && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Products Inventory</CardTitle>
            <CardDescription>
              Showing {data?.data.length} products
            </CardDescription>
          </CardHeader>

          <CardContent>
            <DataTablePaginate
              columns={columns}
              data={data?.data ?? []}
              loading={isLoading}
              currentPage={data?.meta?.current_page ?? 1}
              totalItems={data?.meta?.total || 0}
              itemsPerPage={data?.meta?.per_page ?? 0}
            />

            <PaginationTable
              currentPage={data?.meta?.current_page ?? 1}
              totalItems={data?.meta?.total || 0}
              itemsPerPage={data?.meta?.per_page ?? 0}
              lastPage={data?.meta.last_page ?? 1}
              className="mt-6"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
