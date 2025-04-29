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

import CategoryForm from "@/components/shared/dashboard/CategoryForm";
import { toast } from "sonner";
import { useCategory } from "@/hooks/use-categories";

export default function CategoriesClient() {
  const { data, error, isPending } = useCategory();

  if (error) {
    toast.error(error.message as string, {
      description: "Failed to fetch categories",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Manage your product categories
          </p>
        </div>

        <DialogWrapper
          title="Add New Category"
          description="Create a new product category."
          dialogTrigger={
            <Button variant="default">
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </Button>
          }
        >
          <CategoryForm type="create" />
        </DialogWrapper>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Categories</CardTitle>
          <CardDescription>Showing {data.length} categories</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} loading={isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
