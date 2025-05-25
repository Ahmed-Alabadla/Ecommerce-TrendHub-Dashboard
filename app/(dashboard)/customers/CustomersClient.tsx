"use client";

import { DataTable } from "@/components/shared/dashboard/table/DataTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toast } from "sonner";
import TableSkeleton from "@/components/shared/dashboard/table/TableSkeleton";
import { useCustomers } from "@/hooks/use-customers";
import { columns } from "./columns";

export default function CustomersClient() {
  const { data, error, isError, isPending, refetch } = useCustomers();

  if (isError) {
    toast.error(error?.message as string, {
      description: "Failed to fetch customers",
      duration: 3000,
      action: {
        label: "Retry",
        onClick: () => refetch(),
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">
            Manage and track your customer base
          </p>
        </div>
      </div>
      {isPending && <TableSkeleton />}
      {data && !isPending && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Customer List</CardTitle>
            <CardDescription>Showing {data.length} customers</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={data} loading={isPending} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
