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
import { useCarts } from "@/hooks/use-carts";

export default function CartsClient() {
  const { data, error, isError, isPending } = useCarts();

  if (isError) {
    toast.error(error?.message as string, {
      description: "Failed to fetch carts data",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Carts</h2>
          <p className="text-muted-foreground">
            Manage your store&apos;s carts and their contents.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Carts</CardTitle>
          <CardDescription>Showing {data?.length} Coupons</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data ?? []} loading={isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
