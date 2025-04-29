// "use client";
import CouponForm from "@/components/shared/dashboard/CouponForm";
import DeleteAlertDialog from "@/components/shared/dashboard/DeleteAlertDialog";
import { DialogWrapper } from "@/components/shared/dashboard/DialogWrapper";
import { DataTableColumnHeader } from "@/components/shared/dashboard/table/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coupon } from "@/types/coupon";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";

export const columns: ColumnDef<Coupon>[] = [
  {
    accessorKey: "code",
    header: "Code",

    cell: ({ row }) => {
      return <p className="font-medium">{row.getValue("code")}</p>;
    },
  },

  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      return (
        <p className="font-medium">
          {row.getValue("type") === "percentage"
            ? "Percentage"
            : "Fixed Amount"}
        </p>
      );
    },
  },

  {
    accessorKey: "discount",
    header: "Discount",
    cell: ({ row }) => {
      return (
        <p className="font-medium">
          {row.getValue("type") === "percentage"
            ? `${row.getValue("discount")}%`
            : `$${row.getValue("discount")}`}
        </p>
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
    accessorKey: "expirationDate",
    header: "Expiration Date",
    cell: ({ row }) => {
      return (
        <p className="font-medium">
          {new Date(row.getValue("expirationDate")).toLocaleString()}
        </p>
      );
    },
  },

  {
    header: "Status",
    cell: ({ row }) => {
      const now = new Date();
      const isExpired = new Date(row.getValue("expirationDate")) < now;
      return (
        <Badge variant={isExpired ? "destructive" : "default"}>
          {isExpired ? "Expired" : "Active"}
        </Badge>
      );
    },
  },

  {
    accessorKey: "maxUsage",
    header: "Max Usage",
    cell: ({ row }) => <>{row.getValue("maxUsage")}</>,
  },

  {
    accessorKey: "currentUsage",
    header: "Current Usage",
    cell: ({ row }) => <>{row.getValue("currentUsage")}</>,
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const coupon = row.original;

      return (
        <div className="flex gap-2">
          <DialogWrapper
            title="Edit Coupon"
            description="Update the details of this coupon."
            dialogTrigger={
              <Button variant="default" size="icon">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            }
          >
            <CouponForm
              type="edit"
              defaultValues={{ ...coupon }}
              id={coupon.id}
            />
          </DialogWrapper>

          <DeleteAlertDialog
            title="Coupon"
            name={coupon.code}
            dialogTrigger={
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            }
          >
            <CouponForm type="delete" id={coupon.id} />
          </DeleteAlertDialog>
        </div>
      );
    },
  },
];
