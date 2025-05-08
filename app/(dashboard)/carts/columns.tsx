// "use client";

import CartDetails from "@/components/shared/dashboard/CartDetails";
import { DataTableColumnHeader } from "@/components/shared/dashboard/table/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Cart, CartItem } from "@/types/cart";
import { Coupon } from "@/types/coupon";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

export const columns: ColumnDef<Cart>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <p className="font-medium">#{row.getValue("id")}</p>;
    },
  },

  {
    accessorKey: "user",
    header: "Customer",
    cell: ({ row }) => {
      const user = row.getValue("user") as { name: string };
      return <p>{user.name}</p>;
    },
  },

  {
    accessorKey: "cartItems",
    header: "Items",
    cell: ({ row }) => {
      const cartItems = row.getValue("cartItems") as CartItem[];
      return <p>{cartItems.length}</p>;
    },
  },

  {
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Price" />
    ),
    cell: ({ row }) => {
      return <p className="font-medium">${row.getValue("totalPrice")}</p>;
    },
  },
  {
    accessorKey: "totalPriceAfterDiscount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Price Discount" />
    ),
    cell: ({ row }) => {
      return (
        <p className="font-medium">
          {row.getValue("totalPriceAfterDiscount")
            ? "$" + row.getValue("totalPriceAfterDiscount")
            : "N/A"}
        </p>
      );
    },
  },

  {
    accessorKey: "coupon",
    header: "Coupon",
    cell: ({ row }) => {
      const coupon = row.getValue("coupon") as Coupon | null;
      if (!coupon) return <p>N/A</p>;
      return <p className="font-medium">{coupon.code}</p>;
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
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => (
      <>{new Date(row.getValue("updatedAt")).toLocaleString()}</>
    ),
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const cart = row.original;

      return (
        <Dialog>
          <DialogTrigger asChild className="cursor-pointer">
            <Button size="icon" className="w-8 h-8 p-0">
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>

          <DialogContent
            className={`sm:max-w-xl`}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader className="mb-3">
              <DialogTitle className="text-start text-primary font-bold">
                Cart #{cart.id} - {cart.user.name}
              </DialogTitle>
              <DialogDescription>
                Created on {new Date(cart.createAt).toLocaleString()} • Last
                updated on {new Date(cart.updatedAt).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <CartDetails cartItems={cart.cartItems} />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
