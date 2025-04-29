// "use client";
import DeleteAlertDialog from "@/components/shared/dashboard/DeleteAlertDialog";
import { DialogWrapper } from "@/components/shared/dashboard/DialogWrapper";
import SubCategoryForm from "@/components/shared/dashboard/SubCategoryForm";
import { DataTableColumnHeader } from "@/components/shared/dashboard/table/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/category";
import { SubCategory } from "@/types/subCategory";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, FolderOpen, Trash2 } from "lucide-react";

export const columns: ColumnDef<SubCategory>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <p className="font-medium">#{row.getValue("id")}</p>;
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),

    cell: ({ row }) => {
      return (
        <p className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-muted-foreground" />
          {row.getValue("name")}
        </p>
      );
    },
  },

  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => <>{row.getValue("slug")}</>,
  },

  // {
  //   accessorKey: "products",
  //   header: "Products",
  //   cell: ({ row }) => <>{row.getValue("products")}</>,
  // },

  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parent Category" />
    ),

    cell: ({ row }) => {
      const category = row.getValue("category") as Category;
      return <>{category.name}</>;
    },
  },

  {
    accessorKey: "createAt",
    header: "Create At ",
    cell: ({ row }) => (
      <>{new Date(row.getValue("createAt")).toLocaleString()}</>
    ),
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const subcategory = row.original;

      return (
        <div className="flex gap-2">
          <DialogWrapper
            title="Edit Sub Category"
            description="Update subcategory details."
            dialogTrigger={
              <Button variant="default" size="icon">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            }
          >
            <SubCategoryForm
              type="edit"
              defaultValues={{ ...subcategory }}
              id={subcategory.id}
            />
          </DialogWrapper>

          <DeleteAlertDialog
            title="Sub Category"
            name={subcategory.name}
            dialogTrigger={
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            }
          >
            <SubCategoryForm type="delete" id={subcategory.id} />
          </DeleteAlertDialog>
        </div>
      );
    },
  },
];
