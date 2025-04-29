"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserSchema } from "@/schemas";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { apiCreateUser, apiDeleteUser, apiUpdateUser } from "@/lib/api/user";
import { queryClient } from "@/lib/react-query/client";

type UserFormValues = z.infer<typeof CreateUserSchema>;

interface UserFormProps {
  type: "create" | "edit" | "delete";

  defaultValues?: Partial<User>;
  onClose?: () => void; // Add this prop
  id?: number;
}

export default function UserForm({
  type,
  defaultValues,
  onClose,
  id,
}: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      ...defaultValues,
      name: defaultValues?.name,
      email: defaultValues?.email,
      phone: defaultValues?.phone ?? undefined,
      address: defaultValues?.address ?? undefined,
      gender:
        defaultValues?.gender === "male" || defaultValues?.gender === "female"
          ? defaultValues.gender
          : undefined,
    },
  });

  const addMutation = useMutation({
    mutationFn: apiCreateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      toast.success("User created successfully", {
        duration: 5000,
        description: "User has been created successfully",
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
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      apiUpdateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully", {
        description: "User has been updated successfully",
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
    mutationFn: apiDeleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast.success("User deleted successfully", {
        duration: 5000,
        description: "User has been deleted successfully",
      });
      onClose?.();
    },
    onError: (error) => {
      toast.error("Deletion failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const onSubmit = (data: UserFormValues) => {
    // if (!form.formState.isValid) {
    //   console.log("Form errors:", form.formState.errors);
    //   return;
    // }
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter name"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter email"
                  {...field}
                  disabled={addMutation.isPending || updateMutation.isPending}
                  readOnly={type === "edit"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter phone number"
                  {...field}
                  value={field.value!}
                  disabled={addMutation.isPending || updateMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={addMutation.isPending || updateMutation.isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
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
              ? "Create User"
              : "Save Changes"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
