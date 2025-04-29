"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CouponSchema } from "@/schemas";
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
import { Coupon, CreateCouponDto } from "@/types/coupon";
import {
  apiCreateCoupon,
  apiDeleteCoupon,
  apiUpdateCoupon,
} from "@/lib/api/coupon";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "./DatePicker";

type CouponFormValues = z.infer<typeof CouponSchema>;

interface CouponFormProps {
  type: "create" | "edit" | "delete";

  defaultValues?: Partial<Coupon>;
  onClose?: () => void; // Add this prop
  id?: number;
}

export default function CouponForm({
  type,
  defaultValues,
  onClose,
  id,
}: CouponFormProps) {
  const form = useForm<CouponFormValues>({
    resolver: zodResolver(CouponSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const addMutation = useMutation({
    mutationFn: apiCreateCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["coupons"],
      });

      toast.success("Coupon created successfully", {
        duration: 5000,
        description: "Coupon has been created successfully",
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
      data: Partial<CreateCouponDto>;
    }) => apiUpdateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Coupon updated successfully", {
        description: "Coupon has been updated successfully",
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
    mutationFn: apiDeleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["coupons"],
      });
      toast.success("Coupon deleted successfully", {
        duration: 5000,
        description: "Coupon has been deleted successfully",
      });
      onClose?.();
    },
    onError: (error) => {
      toast.error("Deletion failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const onSubmit = (data: CouponFormValues) => {
    if (type === "create") {
      addMutation.mutate({
        ...data,
        expirationDate: new Date(data.expirationDate),
      });
    } else if (id && type === "edit") {
      updateMutation.mutate({
        id,
        data: {
          ...data,
          expirationDate: new Date(data.expirationDate),
        },
      });
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
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., SUMMER20"
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={addMutation.isPending || updateMutation.isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select coupon type" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={
                    form.getValues("type") === "percentage"
                      ? "e.g., 10 for 10%"
                      : "e.g., 15 for $15"
                  }
                  min={0}
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
          name="maxUsage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Usage</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 100"
                  min={1}
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
          name="expirationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiration Date</FormLabel>
              <FormControl>
                {/* <Input
                  type="date"
                  {...field}
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split("T")[0]
                      : field.value
                  }
                  disabled={addMutation.isPending || updateMutation.isPending}
                /> */}
                <DatePicker
                  selected={field.value ? new Date(field.value) : undefined}
                  onChange={field.onChange}
                />
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
              ? "Create Coupon"
              : "Save Changes"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
