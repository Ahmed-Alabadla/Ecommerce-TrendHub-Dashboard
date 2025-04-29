"use client";

import { DialogWrapper } from "@/components/shared/dashboard/DialogWrapper";
import { DataTable } from "@/components/shared/dashboard/table/DataTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { columns } from "./columns";

import { toast } from "sonner";
import { useSuppliers } from "@/hooks/use-suppliers";
import SupplierForm from "@/components/shared/dashboard/SupplierForm";

export default function SuppliersClient() {
  const { data, error, isError, isPending } = useSuppliers();

  if (isError) {
    toast.error(error?.message as string, {
      description: "Failed to fetch coupons",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
          <p className="text-muted-foreground">Manage your product suppliers</p>
        </div>

        <DialogWrapper
          title="Add New Supplier"
          description="Create a new product supplier."
          dialogTrigger={
            <Button variant="default">
              <Plus className="h-4 w-4" />
              <span>Add Supplier</span>
            </Button>
          }
        >
          <SupplierForm type="create" />
        </DialogWrapper>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Suppliers</CardTitle>
          <CardDescription>
            Showing {data?.length || 0} Suppliers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data || []} loading={isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
