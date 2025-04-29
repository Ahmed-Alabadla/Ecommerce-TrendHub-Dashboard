// "use client";
import CategoryForm from "@/components/shared/dashboard/CategoryForm";
import DeleteAlertDialog from "@/components/shared/dashboard/DeleteAlertDialog";
import { DialogWrapper } from "@/components/shared/dashboard/DialogWrapper";
import ImageDialog from "@/components/shared/dashboard/ImageDialog";
import { DataTableColumnHeader } from "@/components/shared/dashboard/table/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/category";
import { SubCategory } from "@/types/subCategory";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, FolderOpen, Trash2 } from "lucide-react";
import { StaticImageData } from "next/image";

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="w-12 h-12">
        <ImageDialog
          imageUrl={row.getValue("image") as StaticImageData}
          title={row.getValue("name")}
        />
      </div>
    ),
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
    accessorKey: "subCategories",
    header: "Sub Categories",
    cell: ({ row }) => {
      const subCategories = row.getValue("subCategories") as SubCategory[];
      return <>{subCategories.length}</>;
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
      const category = row.original;

      return (
        <div className="flex gap-2">
          <DialogWrapper
            title="Edit Category"
            description="Update category details."
            dialogTrigger={
              <Button variant="default" size="icon">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            }
          >
            <CategoryForm
              type="edit"
              defaultValues={{ ...category }}
              id={category.id}
            />
          </DialogWrapper>

          <DeleteAlertDialog
            title="Category"
            name={category.name}
            dialogTrigger={
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            }
          >
            <CategoryForm type="delete" id={category.id} />
          </DeleteAlertDialog>
        </div>
      );
    },
  },
];
