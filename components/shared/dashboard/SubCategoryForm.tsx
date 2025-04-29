"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubCategorySchema } from "@/schemas";
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
import { CreateSubCategoryDto, SubCategory } from "@/types/subCategory";
import {
  apiCreateSubCategory,
  apiDeleteSubCategory,
  apiUpdateSubCategory,
} from "@/lib/api/subcategory";
import { useCategory } from "@/hooks/use-categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SubCategoryFormValues = z.infer<typeof SubCategorySchema>;

interface CategoryFormProps {
  type: "create" | "edit" | "delete";

  defaultValues?: Partial<SubCategory>;
  onClose?: () => void; // Add this prop
  id?: number;
}

export default function SubCategoryForm({
  type,
  defaultValues,
  onClose,
  id,
}: CategoryFormProps) {
  const { data } = useCategory();

  const form = useForm<SubCategoryFormValues>({
    resolver: zodResolver(SubCategorySchema),
    defaultValues: {
      ...defaultValues,
      name: defaultValues?.name || "",
      slug: defaultValues?.slug || "",
      categoryId: defaultValues?.category?.id || undefined,
    },
  });

  const addMutation = useMutation({
    mutationFn: apiCreateSubCategory,
    onSuccess: (newSubCategory) => {
      queryClient.setQueryData<SubCategory[] | undefined>(
        ["subcategories"],
        (old) => {
          if (!old) return [newSubCategory];
          return [...old, newSubCategory];
        }
      );
      queryClient.invalidateQueries({
        queryKey: ["subcategories"],
      });

      toast.success("Sub Category created successfully", {
        duration: 5000,
        description: "Sub Category has been created successfully",
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
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateSubCategoryDto>;
    }) => apiUpdateSubCategory(id, data),

    onSuccess: (newSubCategory) => {
      queryClient.setQueryData<SubCategory[] | undefined>(
        ["subcategories"],
        (old) => {
          if (!old) return [newSubCategory];
          return old.map((subcategory) =>
            subcategory.id === newSubCategory.id ? newSubCategory : subcategory
          );
        }
      );
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });

      toast.success("Sub Category updated successfully", {
        description: "Sub Category has been updated successfully",
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
    mutationFn: apiDeleteSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subcategories"],
      });
      toast.success("Sub Category deleted successfully", {
        duration: 5000,
        description: "Sub Category has been deleted successfully",
      });
      onClose?.();
    },
    onError: (error) => {
      toast.error("Deletion failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const onSubmit = (data: SubCategoryFormValues) => {
    console.log("data => ", data);

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sub Category Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter subcategory name"
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
          name="categoryId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Parent Category</FormLabel>

              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString() || ""}
                  disabled={addMutation.isPending || updateMutation.isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent className="w-full max-h-80 overflow-y-auto">
                    {data.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground  hover:font-medium"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
