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
import { useBrands } from "@/hooks/use-brands";
import BrandForm from "@/components/shared/dashboard/BrandForm";

export default function BrandsClient() {
  const { data, error, isError, isPending } = useBrands();

  if (isError) {
    toast.error(error?.message as string, {
      description: "Failed to fetch brands",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Brands</h2>
          <p className="text-muted-foreground">Manage your product brands</p>
        </div>

        <DialogWrapper
          title="Add New Brand"
          description="Create a new product brand."
          dialogTrigger={
            <Button variant="default">
              <Plus className="h-4 w-4" />
              <span>Add Brand</span>
            </Button>
          }
        >
          <BrandForm type="create" />
        </DialogWrapper>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Brands</CardTitle>
          <CardDescription>Showing {data.length} brands</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} loading={isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
