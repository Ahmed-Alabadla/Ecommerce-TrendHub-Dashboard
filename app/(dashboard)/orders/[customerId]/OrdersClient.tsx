"use client";

import { DataTable } from "@/components/shared/dashboard/table/DataTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { columns } from "./columns";

import { toast } from "sonner";

import { apiGetOrders } from "@/lib/api/order";
import { useQuery } from "@tanstack/react-query";
import { useCustomers } from "@/hooks/use-customers";

export default function OrdersClient({ customerId }: { customerId: string }) {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["orders", customerId],
    queryFn: () => apiGetOrders(customerId),
    staleTime: 60 * 1000, // 1 minute stale time
    retry: 2, // Retry twice before failing
    enabled: !!customerId, // Only run the query if customerId is set
  });

  const { data: customerOrders } = useCustomers();
  if (isError) {
    toast.error("Failed to fetch orders", {
      description: error?.message || "Please try again later",
      action: {
        label: "Retry",
        onClick: () => refetch(),
      },
    });
  }

  if (!customerId) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">
          Please select a customer to view their orders.
        </p>
      </div>
    );
  }

  if (
    customerOrders &&
    !customerOrders.some((customer) => customer.id === Number(customerId))
  ) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">
          No orders found for this customer.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Orders -{" "}
            <span className="text-primary">
              Customer :{" "}
              {customerOrders?.find(
                (customer) => customer.id === Number(customerId)
              )?.name || "Unknown"}
            </span>
          </h2>
          <p className="text-muted-foreground">
            Manage and track customer orders
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Orders List</CardTitle>
          <CardDescription>Showing {data?.length} orders</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data ?? []}
            loading={!!customerId && isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
