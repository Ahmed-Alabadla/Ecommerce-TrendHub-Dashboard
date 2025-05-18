"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderSchema } from "@/schemas";

import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiUpdateStatusOrder } from "@/lib/api/order";

type OrderFormValues = z.infer<typeof OrderSchema>;

interface OrderFormProps {
  id: number;
  onClose?: () => void; // Add this prop
}

export default function OrderForm({ onClose, id }: OrderFormProps) {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderSchema),
  });

  const mutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { status: "paid" | "cancelled" };
    }) => apiUpdateStatusOrder(id, data),
    onSuccess: (order) => {
      queryClient.invalidateQueries({
        queryKey: ["orders", order.user.id],
      });

      toast.success("Order created successfully", {
        duration: 5000,
        description: "Order has been created successfully",
      });
      onClose?.();
    },
    onError: (error) => {
      toast.error("Operation failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const onSubmit = (value: OrderFormValues) => {
    mutation.mutate({ id, data: value });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Status</FormLabel>

              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value || ""}
                  disabled={mutation.isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="w-full max-h-80 overflow-y-auto">
                    <SelectItem
                      value="paid"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground  hover:font-medium"
                    >
                      Paid
                    </SelectItem>
                    <SelectItem
                      value="cancelled"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground  hover:font-medium"
                    >
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={mutation.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || mutation.isPending}
          >
            {mutation.isPending ? "Processing..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
