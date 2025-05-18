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
import { useCustomers } from "@/hooks/use-customers";
import { useState } from "react";
import { apiGetOrders } from "@/lib/api/order";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OrdersClient() {
  const {
    data: dataCustomers,
    error: errorCustomer,
    isError: isErrorCustomer,
    isPending: isPendingCustomer,
  } = useCustomers();

  if (isErrorCustomer) {
    toast.error(errorCustomer?.message as string, {
      description: "Failed to fetch customer data",
    });
  }

  const [customerId, setCustomerId] = useState<number>();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["orders", customerId],
    queryFn: () => apiGetOrders(customerId!),
    staleTime: 60 * 1000, // 1 minute stale time
    retry: 2, // Retry twice before failing
    retryDelay: 1000, // 1 second between retries
    enabled: !!customerId, // Only run the query if customerId is set
  });

  if (isError) {
    toast.error("Failed to fetch orders", {
      description: error?.message || "Please try again later",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Manage and track customer orders
          </p>
        </div>
      </div>
      <div className=" flex flex-col gap-1">
        <p className="font-medium text-primary">Customer</p>
        <Select
          onValueChange={(value) => setCustomerId(Number(value))}
          value={customerId?.toString()}
          disabled={isPendingCustomer}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent className="w-full max-h-80 overflow-y-auto">
            {dataCustomers && dataCustomers.length === 0 && (
              <div className="flex items-center justify-center w-full h-20">
                <p className="text-muted-foreground">No customers found</p>
              </div>
            )}
            {dataCustomers &&
              dataCustomers.length > 0 &&
              dataCustomers.map((customer) => (
                <SelectItem
                  key={customer.id}
                  value={customer.id.toString()}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground  hover:font-medium"
                >
                  {customer.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
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
