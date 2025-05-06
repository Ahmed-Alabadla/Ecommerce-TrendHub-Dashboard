// "use client";
import DeleteAlertDialog from "@/components/shared/dashboard/DeleteAlertDialog";
import { DialogWrapper } from "@/components/shared/dashboard/DialogWrapper";
import ProductForm from "@/components/shared/dashboard/ProductForm";
import ProductImagesDialog from "@/components/shared/dashboard/ProductImagesDialog";
import { DataTableColumnHeader } from "@/components/shared/dashboard/table/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Star, Tag, Trash2 } from "lucide-react";
import Link from "next/link";

const renderStars = (ratingsAverage: number, ratingsQuantity: number) => {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span>{ratingsAverage.toFixed(1)}</span>
      <span className="text-xs text-muted-foreground">({ratingsQuantity})</span>
    </div>
  );
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <p className="font-medium">#{row.getValue("id")}</p>;
    },
  },

  {
    header: "Images",
    accessorKey: "images",
    cell: ({ row }) => {
      const product = row.original;
      return <ProductImagesDialog product={product} />;
    },
  },

  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">{row.getValue("name")}</div>
    ),
  },

  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = row.getValue("category") as { name: string };
      return <p>{category?.name}</p>;
    },
  },
  {
    accessorKey: "subCategory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub Category" />
    ),
    cell: ({ row }) => {
      const subCategory = row.getValue("subCategory") as { name: string };
      return <p>{subCategory?.name ?? "--"}</p>;
    },
  },
  {
    accessorKey: "brand",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Brand" />
    ),
    cell: ({ row }) => {
      const brand = row.getValue("brand") as { name: string };
      return (
        <p className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          {brand?.name ?? "--"}
        </p>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      return <p>${row.getValue("price")}</p>;
    },
  },

  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => {
      const quantity = row.getValue("quantity") as number;
      return <p>{quantity}</p>;
    },
  },

  {
    accessorKey: "sold",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sold" />
    ),
    cell: ({ row }) => {
      const sold = row.getValue("sold") as number;
      return <p>{sold}</p>;
    },
  },

  {
    accessorKey: "ratingsAverage",
    header: "Rating",
    cell: ({ row }) => {
      const product = row.original;
      const ratingsAverage = Number(product.ratingsAverage);
      const ratingsQuantity = product.ratingsQuantity;
      return renderStars(ratingsAverage, ratingsQuantity);
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "Active"
              ? "default"
              : status === "OutOfStock"
              ? "secondary"
              : "destructive"
          }
        >
          {status === "OutOfStock" ? "Out of Stock" : status}
        </Badge>
      );
    },
  },

  {
    accessorKey: "createAt",
    header: "Create At",
    cell: ({ row }) => (
      <>{new Date(row.getValue("createAt")).toLocaleString()}</>
    ),
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex gap-2">
          <Link href={`/products/${product.id}`} passHref>
            <Button size="icon" variant="secondary">
              <Eye />
            </Button>
          </Link>

          <DialogWrapper
            title="Edit product"
            description="Update the details of this coupon."
            dialogTrigger={
              <Button variant="default" size="icon">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            }
          >
            <ProductForm
              type="edit"
              defaultValues={{ ...product }}
              id={product.id}
            />
          </DialogWrapper>

          <DeleteAlertDialog
            title="Product"
            name={product.name}
            dialogTrigger={
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            }
          >
            <ProductForm type="delete" id={product.id} />
          </DeleteAlertDialog>
        </div>
      );
    },
  },
];
