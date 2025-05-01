"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query/client";
import { apiDeleteReview } from "@/lib/api/review";

interface ReviewFormProps {
  id: number;
}

export default function ReviewForm({ id }: ReviewFormProps) {
  const deleteMutation = useMutation({
    mutationFn: apiDeleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
      toast.success("Review deleted successfully", {
        duration: 5000,
        description: "Review has been deleted successfully",
      });
    },
    onError: (error) => {
      toast.error("Deletion failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const handleDelete = () => {
    if (!id) return;
    deleteMutation.mutate(id);
  };

  return (
    <AlertDialogFooter>
      <AlertDialogCancel
        className="cursor-pointer"
        disabled={deleteMutation.isPending}
      >
        Cancel
      </AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDelete}
        className="bg-destructive text-white hover:bg-destructive/70 cursor-pointer"
        disabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? "Deleting..." : "Delete"}
      </AlertDialogAction>
    </AlertDialogFooter>
  );
}
