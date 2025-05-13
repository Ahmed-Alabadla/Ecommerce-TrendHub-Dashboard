"use client";

import { DatePicker } from "@/components/shared/dashboard/DatePicker";
import { ImageDropzone } from "@/components/shared/dashboard/ImageDropzone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { usePasswordStrength } from "@/hooks/use-password-strength";
import { useProfile } from "@/hooks/use-profile";
import { apiChangePassword, apiUpdateProfile } from "@/lib/api/profile";
import { queryClient } from "@/lib/react-query/client";
import { ChangePasswordSchema, profileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type ProfileFormValues = z.infer<typeof profileSchema>;
type ChangePasswordFormValues = z.infer<typeof ChangePasswordSchema>;

export default function ProfileSettings() {
  const { data, isError, error } = useProfile();

  if (isError) {
    toast.error("Error fetching profile: " + error.message, {
      description: "Please try again later.",
      duration: 3000,
    });
  }

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      address: data?.address || "",
      avatar: data?.avatar || "",
      birth_date: data?.birth_date || "",
      gender: data?.gender as "male" | "female",
      name: data?.name,
      phone: data?.phone || "",
    },
  });
  const changePasswordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const passwordValue = changePasswordForm.watch("newPassword") || "";
  const { message, getColor, getPercentage } =
    usePasswordStrength(passwordValue);

  const updateProfileMutation = useMutation({
    mutationKey: ["profile"],
    mutationFn: apiUpdateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      toast.success("Profile saved", {
        duration: 5000,
        description: "Your profile information has been updated successfully.",
      });
    },
    onError: (error) => {
      toast.error("Operation failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: apiChangePassword,
    onSuccess: () => {
      toast.success("Password saved", {
        duration: 5000,
        description: "Your password has been updated successfully.",
      });
      changePasswordForm.reset();
    },
    onError: (error) => {
      toast.error("Operation failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
  const onSubmitUpdateProfile = (data: ProfileFormValues) => {
    console.log(data);

    updateProfileMutation.mutate(data);
  };
  const onSubmitChangePassword = (data: ChangePasswordFormValues) => {
    changePasswordMutation.mutate({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit(onSubmitUpdateProfile)}
            className="space-y-4"
          >
            <FormField
              control={profileForm.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <ImageDropzone
                      width={250}
                      height={250}
                      value={field.value}
                      onChange={(file) => {
                        field.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Profile Information</h3>
                <p className="text-sm text-muted-foreground">
                  Update your account details
                </p>
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={updateProfileMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      readOnly
                      defaultValue={data?.email}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue={data?.role} readOnly />
                  </div>
                  <FormField
                    control={profileForm.control}
                    name="birth_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onChange={field.onChange}
                            disabled={updateProfileMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter phone number"
                            {...field}
                            value={field.value!}
                            disabled={updateProfileMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={updateProfileMutation.isPending}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={profileForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter address"
                          {...field}
                          disabled={updateProfileMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  updateProfileMutation.isPending ||
                  !profileForm.formState.isDirty
                }
              >
                {updateProfileMutation.isPending
                  ? "Processing..."
                  : "Update Profile"}
              </Button>
            </div>
          </form>
        </Form>
        <Separator />

        <form
          onSubmit={changePasswordForm.handleSubmit(onSubmitChangePassword)}
          className="space-y-4"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Password</h3>
              <p className="text-sm text-muted-foreground">
                Change your password
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  {...changePasswordForm.register("oldPassword")}
                  placeholder="Password"
                  disabled={changePasswordMutation.isPending}
                />
                {changePasswordForm.formState.errors.oldPassword && (
                  <p className="text-sm text-red-500">
                    {changePasswordForm.formState.errors.oldPassword.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  {...changePasswordForm.register("newPassword")}
                  placeholder="Password"
                  disabled={changePasswordMutation.isPending}
                />
                {passwordValue && (
                  <div className="mt-1">
                    <div className="h-1 w-full bg-gray-200">
                      <div
                        className={`h-full transition-all duration-300 ${getColor()}`}
                        style={{ width: getPercentage() }}
                      />
                    </div>
                    {message && (
                      <p className="text-xs mt-1 text-muted-foreground">
                        {message}
                      </p>
                    )}
                  </div>
                )}
                {changePasswordForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-500">
                    {changePasswordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  {...changePasswordForm.register("confirmPassword")}
                  placeholder="Password"
                  disabled={changePasswordMutation.isPending}
                />
                {changePasswordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {
                      changePasswordForm.formState.errors.confirmPassword
                        .message
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={
                changePasswordMutation.isPending ||
                !changePasswordForm.formState.isDirty
              }
            >
              {changePasswordMutation.isPending
                ? "Processing..."
                : "Change Password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
