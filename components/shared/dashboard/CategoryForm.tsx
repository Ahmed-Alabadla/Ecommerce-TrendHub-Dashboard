"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategorySchema } from "@/schemas";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query/client";
import { Category } from "@/types/category";
import Image from "next/image";
import {
  apiCreateCategory,
  apiDeleteCategory,
  apiUpdateCategory,
} from "@/lib/api/category";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/svg+xml",
  "image/webp",
] as const;

type CategoryFormValues = z.infer<typeof CategorySchema>;

interface CategoryFormProps {
  type: "create" | "edit" | "delete";

  defaultValues?: Partial<Category>;
  onClose?: () => void; // Add this prop
  id?: number;
}

export default function CategoryForm({
  type,
  defaultValues,
  onClose,
  id,
}: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      ...defaultValues,
      name: defaultValues?.name,
      image: defaultValues?.image,
    },
  });

  const addMutation = useMutation({
    mutationFn: apiCreateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      toast.success("Category created successfully", {
        duration: 5000,
        description: "Category has been created successfully",
      });
      onClose?.();
    },
    onError: (error) => {
      toast.error("Operation failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Category> }) =>
      apiUpdateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully", {
        description: "Category has been updated successfully",
        duration: 5000,
      });
      onClose?.();
    },
    onError: (error) => {
      toast.error("Operation failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: apiDeleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      toast.success("Category deleted successfully", {
        duration: 5000,
        description: "Category has been deleted successfully",
      });
      onClose?.();
    },
    onError: (error) => {
      toast.error("Deletion failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const onSubmit = (data: CategoryFormValues) => {
    if (type === "create") {
      addMutation.mutate(data);
    } else if (id && type === "edit") {
      updateMutation.mutate({ id, data });
    }
  };

  const handleDelete = () => {
    if (!id) return;
    deleteMutation.mutate(id);
  };

  if (type === "delete") {
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Max image size is 1MB.`, {
          duration: 5000,
        });
        e.target.value = "";
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type as any)) {
        toast.error(
          "Only .jpg, .jpeg, .png, .svg and .webp formats are supported.",
          {
            duration: 5000,
          }
        );
        e.target.value = "";
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        form.setValue("image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter category name"
                  {...field}
                  disabled={addMutation.isPending || updateMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter slug"
                  {...field}
                  disabled={addMutation.isPending || updateMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {field.value && (
                    <div className="relative w-full flex items-center justify-center overflow-hidden">
                      <Image
                        src={field.value}
                        alt="Preview"
                        className="object-cover object-center rounded-lg"
                        width={250}
                        height={250}
                      />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={addMutation.isPending || updateMutation.isPending}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={
              form.formState.isSubmitting ||
              addMutation.isPending ||
              updateMutation.isPending
            }
          >
            {addMutation.isPending || updateMutation.isPending
              ? "Processing..."
              : type === "create"
              ? "Create Category"
              : "Save Changes"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
