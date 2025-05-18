// "use client";

import { DialogWrapper } from "@/components/shared/dashboard/DialogWrapper";
import OrderDetails from "@/components/shared/dashboard/OrderDetails";
import OrderForm from "@/components/shared/dashboard/OrderForm";
import { DataTableColumnHeader } from "@/components/shared/dashboard/table/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Order, OrderItem } from "@/types/order";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order Number",
    cell: ({ row }) => {
      return <p className="font-medium">{row.getValue("orderNumber")}</p>;
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
    accessorKey: "orderItems",
    header: "Items",
    cell: ({ row }) => {
      const orderItems = row.getValue("orderItems") as OrderItem[];
      return <p>{orderItems.length}</p>;
    },
  },

  {
    accessorKey: "totalOrderPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Price" />
    ),
    cell: ({ row }) => {
      return <p className="font-medium">${row.getValue("totalOrderPrice")}</p>;
    },
  },

  {
    accessorKey: "paymentMethodType",
    header: "Payment Method",
    cell: ({ row }) => {
      return (
        <Badge
          className={`capitalize
          ${
            row.getValue("paymentMethodType") === "card"
              ? "bg-blue-100 text-blue-800"
              : "bg-purple-100 text-purple-800"
          }
          `}
        >
          {row.getValue("paymentMethodType")}
        </Badge>
      );
    },
  },

  {
    accessorKey: "isPaid",
    header: "Paid",
    cell: ({ row }) => {
      return <p>{row.getValue("isPaid") ? "Yes" : "No"}</p>;
    },
  },
  {
    accessorKey: "paidAt",
    header: "Paid At",
    cell: ({ row }) => {
      return (
        <p>
          {row.getValue("isPaid")
            ? new Date(row.getValue("paidAt")).toLocaleString()
            : "N/A"}
        </p>
      );
    },
  },

  {
    accessorKey: "isDelivered",
    header: "Delivered",
    cell: ({ row }) => {
      return <p>{row.getValue("isDelivered") ? "Yes" : "No"}</p>;
    },
  },
  {
    accessorKey: "deliveredAt",
    header: "Delivered At",
    cell: ({ row }) => {
      return (
        <p>
          {row.getValue("isDelivered")
            ? new Date(row.getValue("deliveredAt")).toLocaleString()
            : "N/A"}
        </p>
      );
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "pending"
              ? "default"
              : status === "paid"
              ? "default"
              : status === "failed"
              ? "destructive"
              : "destructive"
          }
          className={`capitalize
            ${
              status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : status === "paid"
                ? "bg-green-100 text-green-800"
                : status === "failed"
                ? "bg-red-100 text-red-800"
                : "bg-red-100 text-red-800"
            }
            `}
        >
          {status}
        </Badge>
      );
    },
  },

  {
    accessorKey: "shippingAddress",
    header: "Shipping Address",
    cell: ({ row }) => {
      return <p className="truncate">{row.getValue("shippingAddress")}</p>;
    },
  },

  {
    accessorKey: "stripeCheckoutId",
    header: "Stripe Checkout ID",
    cell: ({ row }) => {
      return (
        <p className="truncate">
          {row.getValue("stripeCheckoutId")
            ? row.getValue("stripeCheckoutId")
            : "N/A"}
        </p>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: "Create At",
    cell: ({ row }) => (
      <>{new Date(row.getValue("createdAt")).toLocaleString()}</>
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
      const order = row.original;

      return (
        <div className="flex items-center gap-2">
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
                  {order.orderNumber} - {order.user.name}
                </DialogTitle>
                <DialogDescription>
                  Created on {new Date(order.createdAt).toLocaleString()} • Last
                  updated on {new Date(order.updatedAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              <OrderDetails order={order} />
            </DialogContent>
          </Dialog>
          <DialogWrapper
            title="Edit Order status"
            description="Update order status."
            dialogTrigger={
              <Button
                variant="default"
                size="icon"
                className="w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600 text-white"
                disabled={
                  order.paymentMethodType === "card" ||
                  order.isPaid ||
                  order.status === "cancelled"
                }
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            }
          >
            <OrderForm id={order.id} />
          </DialogWrapper>
        </div>
      );
    },
  },
];
