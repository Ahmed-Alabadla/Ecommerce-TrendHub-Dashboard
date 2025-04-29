// "use client";
import DeleteAlertDialog from "@/components/shared/dashboard/DeleteAlertDialog";
import { DialogWrapper } from "@/components/shared/dashboard/DialogWrapper";
import SupplierForm from "@/components/shared/dashboard/SupplierForm";
import { Button } from "@/components/ui/button";
import { Supplier } from "@/types/supplier";
import { ColumnDef } from "@tanstack/react-table";
import { EarthIcon, Edit, Mail, Phone, Trash2, Truck } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<Supplier>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <p className="font-medium">#{row.getValue("id")}</p>;
    },
  },

  {
    accessorKey: "name",
    header: "Name",

    cell: ({ row }) => {
      return (
        <p className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-muted-foreground" />
          {row.getValue("name")}
        </p>
      );
    },
  },

  {
    accessorKey: "website",
    header: "Website",

    cell: ({ row }) => {
      return (
        <Link
          href={row.getValue("website")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <EarthIcon className="h-5 w-5 text-muted-foreground" />
          <span className="max-w-xs truncate">{row.getValue("website")}</span>
        </Link>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email Contact",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          {row.getValue("email")}
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          {row.getValue("phone")}
        </div>
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
      const supplier = row.original;

      return (
        <div className="flex gap-2">
          <DialogWrapper
            title="Edit Supplier"
            description="Update supplier details."
            dialogTrigger={
              <Button variant="default" size="icon">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            }
          >
            <SupplierForm
              type="edit"
              defaultValues={{ ...supplier }}
              id={supplier.id}
            />
          </DialogWrapper>

          <DeleteAlertDialog
            title="Supplier"
            name={supplier.name}
            dialogTrigger={
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            }
          >
            <SupplierForm type="delete" id={supplier.id} />
          </DeleteAlertDialog>
        </div>
      );
    },
  },
];
