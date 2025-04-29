// "use client";
import DeleteAlertDialog from "@/components/shared/dashboard/DeleteAlertDialog";
import { DialogWrapper } from "@/components/shared/dashboard/DialogWrapper";
import ImageDialog from "@/components/shared/dashboard/ImageDialog";
import { DataTableColumnHeader } from "@/components/shared/dashboard/table/DataTableColumnHeader";
import UserForm from "@/components/shared/dashboard/UserForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { StaticImageData } from "next/image";

export const columns: ColumnDef<User>[] = [
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
      return <p className="flex items-center gap-2">{row.getValue("name")}</p>;
    },
  },

  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => (
      <div className="w-12 h-12">
        <ImageDialog
          imageUrl={row.getValue("avatar") as StaticImageData}
          title={row.getValue("name")}
        />
      </div>
    ),
  },

  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <>{row.getValue("email")}</>,
  },

  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => <>{row.getValue("role")}</>,
  },

  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge
        variant={row.getValue("isActive") === true ? "default" : "secondary"}
      >
        {
          <span className="capitalize">
            {row.getValue("isActive") ? "Active" : "Inactive"}
          </span>
        }
      </Badge>
    ),
  },

  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <>{row.getValue("phone") ? row.getValue("phone") : "No Phone"}</>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <>{row.getValue("address") ? row.getValue("address") : "No address"}</>
    ),
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => (
      <>
        {row.getValue("gender") === null ? (
          <Badge variant="secondary">--</Badge>
        ) : (
          <Badge
            variant="default"
            className={`${
              row.getValue("gender") === "male" ? "bg-blue-500" : "bg-pink-500"
            }`}
          >
            {row.getValue("gender")}
          </Badge>
        )}
      </>
    ),
  },
  {
    accessorKey: "birth_date",
    header: "Birth Date",
    cell: ({ row }) => (
      <>
        {row.getValue("birth_date") === null
          ? "No Birth Date"
          : new Date(row.getValue("birth_date")).toLocaleDateString()}
      </>
    ),
  },
  {
    accessorKey: "createAt",
    header: "Registered",
    cell: ({ row }) => (
      <>{new Date(row.getValue("createAt")).toLocaleString()}</>
    ),
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex gap-2">
          <DialogWrapper
            title="Edit User"
            description="Update user details."
            dialogTrigger={
              <Button variant="default" size="icon">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            }
          >
            <UserForm
              type="edit"
              defaultValues={{
                ...user,
              }}
              id={user.id}
            />
          </DialogWrapper>

          <DeleteAlertDialog
            title="User"
            name={user.name}
            dialogTrigger={
              <Button
                variant="destructive"
                size="icon"
                disabled={!user.isActive}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            }
          >
            <UserForm type="delete" id={user.id} />
          </DeleteAlertDialog>
        </div>
      );
    },
  },
];
