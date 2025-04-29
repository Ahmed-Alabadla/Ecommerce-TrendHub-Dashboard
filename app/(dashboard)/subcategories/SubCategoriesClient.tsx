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
import { useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiGetSubCategories } from "@/lib/api/subcategory";
import SubCategoryForm from "@/components/shared/dashboard/SubCategoryForm";

export default function SubCategoriesClient() {
  const { data, error, isError, isPending } = useSuspenseQuery({
    queryKey: ["subcategories"],
    queryFn: apiGetSubCategories,
    // staleTime: 1000 * 60 * 60, // 1h
  });

  if (isError) {
    toast.error(error?.message as string, {
      description: "Failed to fetch subcategories",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sub Categories</h2>
          <p className="text-muted-foreground">
            Manage your product subcategories
          </p>
        </div>

        <DialogWrapper
          title="Add New Subcategory"
          description="Create a new product subcategory."
          dialogTrigger={
            <Button variant="default">
              <Plus className="h-4 w-4" />
              <span>Add SubCategory</span>
            </Button>
          }
        >
          <SubCategoryForm type="create" />
        </DialogWrapper>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Sub Categories</CardTitle>
          <CardDescription>Showing {data.length} subcategories</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} loading={isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
