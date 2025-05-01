// "use client";
import DeleteAlertDialog from "@/components/shared/dashboard/DeleteAlertDialog";
import ReviewForm from "@/components/shared/dashboard/ReviewForm";
import { DataTableColumnHeader } from "@/components/shared/dashboard/table/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import { Review } from "@/types/review";
import { ColumnDef } from "@tanstack/react-table";
import { Star, Trash2 } from "lucide-react";

const renderStars = (rating: number) => {
  return Array(5)
    .fill(0)
    .map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
};

export const columns: ColumnDef<Review>[] = [
  {
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),

    cell: ({ row }) => {
      const product = row.getValue("product") as { name: string };
      return <p className="font-medium">{product?.name}</p>;
    },
  },

  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <div className="flex items-center">
        {renderStars(row.getValue("rating"))}
      </div>
    ),
  },

  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.getValue("user") as { name: string };
      return <p>{user?.name}</p>;
    },
  },

  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) => (
      <p className="max-w-xs truncate">{row.getValue("comment")}</p>
    ),
  },

  {
    accessorKey: "createAt",
    header: "Date",
    cell: ({ row }) => (
      <>{new Date(row.getValue("createAt")).toLocaleString()}</>
    ),
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const review = row.original;

      return (
        <div className="flex gap-2">
          <DeleteAlertDialog
            title="Brand"
            name={""}
            dialogTrigger={
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            }
          >
            <ReviewForm id={review.id} />
          </DeleteAlertDialog>
        </div>
      );
    },
  },
];
