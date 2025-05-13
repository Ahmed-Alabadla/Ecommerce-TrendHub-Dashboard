"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings } from "@/hooks/use-settings";
import { apiCreateSettings } from "@/lib/api/settings";
import { queryClient } from "@/lib/react-query/client";
import { settingsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ProfileSettings from "./ProfileSettings";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageDropzone } from "@/components/shared/dashboard/ImageDropzone";

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsClient() {
  const { data, isError, error } = useSettings();

  if (isError) {
    toast.error("Error fetching settings: " + error.message, {
      description: "Please try again later.",
      duration: 3000,
    });
  }

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      store_name: data?.store_name || "",
      store_email: data?.store_email || "",
      store_phone: data?.store_phone || "",
      store_address: data?.store_address || "",
      store_logo: data?.store_logo || "",
      tax_rate: data?.tax_rate || 0,
      tax_enabled: data?.tax_enabled || false,
      shipping_rate: data?.shipping_rate || 0,
      shipping_enabled: data?.shipping_enabled || false,
    },
  });

  const settingsMutation = useMutation({
    mutationFn: apiCreateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["settings"],
      });

      toast.success("Settings saved", {
        duration: 5000,
        description: "Your store information has been updated successfully.",
      });
    },
    onError: (error) => {
      toast.error("Operation failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });
  const onSubmit = (data: SettingsFormValues) => {
    settingsMutation.mutate({
      ...data,
      store_name: data.store_name || "",
      store_email: data.store_email || "",
      store_phone: data.store_phone || "",
      store_address: data.store_address || "",
      store_logo: data.store_logo || "",
      tax_rate: data.tax_rate ?? 0,
      tax_enabled: data.tax_enabled ?? false,
      shipping_rate: data.shipping_rate ?? 0,
      shipping_enabled: data.shipping_enabled ?? false,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your store preferences and configuration
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4 grid grid-cols-2 w-full">
          <TabsTrigger value="general" className="cursor-pointer">
            General
          </TabsTrigger>
          <TabsTrigger value="account" className="cursor-pointer">
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your store information and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Store Information</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your store details
                      </p>
                    </div>

                    <div className="grid gap-4">
                      <FormField
                        control={form.control}
                        name="store_logo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Store Logo</FormLabel>
                            <FormControl>
                              <ImageDropzone
                                width={200}
                                height={200}
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
                      {/* Store Name */}
                      <div className="grid gap-2">
                        <Label htmlFor="store_name">Store Name</Label>
                        <Input
                          id="store_name"
                          {...form.register("store_name")}
                        />
                        {form.formState.errors.store_name && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.store_name.message}
                          </p>
                        )}
                      </div>

                      {/* Store Email */}
                      <div className="grid gap-2">
                        <Label htmlFor="store_email">Store Email</Label>
                        <Input
                          id="store_email"
                          type="email"
                          {...form.register("store_email")}
                        />
                        {form.formState.errors.store_email && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.store_email.message}
                          </p>
                        )}
                      </div>

                      {/* Contact Phone */}
                      <div className="grid gap-2">
                        <Label htmlFor="store_phone">Contact Phone</Label>
                        <Input
                          id="store_phone"
                          type="tel"
                          {...form.register("store_phone")}
                        />
                        {form.formState.errors.store_phone && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.store_phone.message}
                          </p>
                        )}
                      </div>

                      {/* Store Address */}
                      <div className="grid gap-2">
                        <Label htmlFor="store_address">Store Address</Label>
                        <Input
                          id="store_address"
                          {...form.register("store_address")}
                        />
                        {form.formState.errors.store_address && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.store_address.message}
                          </p>
                        )}
                      </div>

                      {/* Tax Settings */}
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="tax_enabled"
                            checked={form.watch("tax_enabled")}
                            onCheckedChange={(checked) =>
                              form.setValue("tax_enabled", Boolean(checked))
                            }
                          />
                          <Label htmlFor="tax_enabled">Enable Taxes</Label>
                        </div>

                        {form.watch("tax_enabled") && (
                          <div className="grid gap-2">
                            <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                            <Input
                              id="tax_rate"
                              type="number"
                              step="0.01"
                              min="0"
                              max="99.99"
                              {...form.register("tax_rate", {
                                valueAsNumber: true,
                              })}
                            />
                            {form.formState.errors.tax_rate && (
                              <p className="text-sm text-red-500">
                                {form.formState.errors.tax_rate.message}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Shipping Settings */}
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="shipping_enabled"
                            checked={form.watch("shipping_enabled")}
                            onCheckedChange={(checked) =>
                              form.setValue(
                                "shipping_enabled",
                                Boolean(checked)
                              )
                            }
                          />
                          <Label htmlFor="shipping_enabled">
                            Enable Shipping
                          </Label>
                        </div>

                        {form.watch("shipping_enabled") && (
                          <div className="grid gap-2">
                            <Label htmlFor="shipping_rate">
                              Shipping Rate (%)
                            </Label>
                            <Input
                              id="shipping_rate"
                              type="number"
                              step="0.01"
                              min="0"
                              max="99.99"
                              {...form.register("shipping_rate", {
                                valueAsNumber: true,
                              })}
                            />
                            {form.formState.errors.shipping_rate && (
                              <p className="text-sm text-red-500">
                                {form.formState.errors.shipping_rate.message}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Separator className="my-6" />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={settingsMutation.isPending}>
                      {settingsMutation.isPending
                        ? "Processing..."
                        : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <ProfileSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
