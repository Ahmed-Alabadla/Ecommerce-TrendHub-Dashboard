// "use client";
import BrandForm from "@/components/shared/dashboard/BrandForm";
import DeleteAlertDialog from "@/components/shared/dashboard/DeleteAlertDialog";
import { DialogWrapper } from "@/components/shared/dashboard/DialogWrapper";
import ImageDialog from "@/components/shared/dashboard/ImageDialog";
import { DataTableColumnHeader } from "@/components/shared/dashboard/table/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { Brand } from "@/types/brand";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Tag, Trash2 } from "lucide-react";
import { StaticImageData } from "next/image";

export const columns: ColumnDef<Brand>[] = [
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
          <Tag className="h-5 w-5 text-muted-foreground" />
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
      const brand = row.original;

      return (
        <div className="flex gap-2">
          <DialogWrapper
            title="Edit Brand"
            description="Update brand details."
            dialogTrigger={
              <Button variant="default" size="icon">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            }
          >
            <BrandForm type="edit" defaultValues={{ ...brand }} id={brand.id} />
          </DialogWrapper>

          <DeleteAlertDialog
            title="Brand"
            name={brand.name}
            dialogTrigger={
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            }
          >
            <BrandForm type="delete" id={brand.id} />
          </DeleteAlertDialog>
        </div>
      );
    },
  },
];
