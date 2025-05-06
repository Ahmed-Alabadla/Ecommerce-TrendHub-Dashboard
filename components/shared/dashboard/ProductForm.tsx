"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema } from "@/schemas";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
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

import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateProductDto, Product, ProductStatus } from "@/types/product";
import { useCategory } from "@/hooks/use-categories";
import { useBrands } from "@/hooks/use-brands";
import { useSubCategories } from "@/hooks/use-subcategories";
import { useEffect, useState } from "react";
import { useImageUpload } from "@/lib/utils";
import {
  apiCreateProduct,
  apiDeleteProduct,
  apiUpdateProduct,
} from "@/lib/api/product";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ImageIcon, Weight, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import ColorPicker from "./ColorPicker";
import IconsDimensions from "./IconsDimensions";
import { Stepper } from "@/components/ui/stepper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ProductFormValues = z.infer<typeof ProductSchema>;

interface ProductFormProps {
  type: "create" | "edit" | "delete";

  defaultValues?: Partial<Product>;
  onClose?: () => void; // Add this prop
  id?: number;
}

export default function ProductForm({
  type,
  defaultValues,
  onClose,
  id,
}: ProductFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 5; // Basic, Images, Classification, Colors, Attributes
  const nextStep = async () => {
    // Validate current step before proceeding
    let isValid = false;

    switch (step) {
      case 1:
        isValid = await form.trigger([
          "name",
          "price",
          "quantity",
          "status",
          "description",
        ]);
        break;
      case 2:
        isValid = await form.trigger(["imageCover"]);
        break;
      case 3:
        isValid = await form.trigger(["categoryId"]);
        break;
      // Steps 4 and 5 are optional so we don't validate them
      default:
        isValid = true;
    }

    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const { data: categories } = useCategory();
  const { data: brands } = useBrands();
  const { data: subcategories } = useSubCategories();

  const { uploadImage, uploadMultipleImages } = useImageUpload();

  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    defaultValues?.category?.id
  );
  const subcategoriesByCategory = subcategories.filter(
    (subcategory) => subcategory.category.id === selectedCategory
  );

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      quantity: defaultValues?.quantity || undefined,
      price: defaultValues?.price || undefined,
      priceAfterDiscount: defaultValues?.priceAfterDiscount || undefined,
      imageCover: defaultValues?.imageCover || undefined,
      status: defaultValues?.status || ProductStatus.ACTIVE,
      images: defaultValues?.images || [],
      categoryId: defaultValues?.category?.id || undefined,
      subCategoryId: defaultValues?.subCategory?.id,
      brandId: defaultValues?.brand?.id,
      colors: defaultValues?.colors || [],
    },
  });

  const addMutation = useMutation({
    mutationFn: apiCreateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      toast.success("Products created successfully", {
        duration: 5000,
        description: "Products has been created successfully",
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
      data: Partial<CreateProductDto>;
    }) => apiUpdateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully", {
        description: "Product has been updated successfully",
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
    mutationFn: apiDeleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      toast.success("Products deleted successfully", {
        duration: 5000,
        description: "Products has been deleted successfully",
      });
      onClose?.();
    },
    onError: (error) => {
      toast.error("Deletion failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    console.log("new product =>", data);

    if (type === "create") {
      addMutation.mutate(data);
    } else if (id && type === "edit") {
      updateMutation.mutate({
        id,
        data: data,
      });
    }
  };

  // Update subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      // Reset subcategory if the current selection doesn't belong to the new category
      form.setValue("subCategoryId", undefined);
    }
  }, [selectedCategory, form]);

  const handleCategoryChange = (value: number) => {
    setSelectedCategory(value);
    form.setValue("categoryId", value);
  };

  const handleCoverImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const imageUrl = await uploadImage(e.target.files[0]);
        console.log("cover =>", imageUrl);

        form.setValue("imageCover", imageUrl);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const handleProductImagesUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        const files = Array.from(e.target.files);
        const imageUrls = await uploadMultipleImages(files);
        const currentImages = form.getValues("images") || [];

        form.setValue("images", [...currentImages, ...imageUrls]);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };
  const removeImage = (index: number) => {
    const currentImages = [...form.getValues("images")];
    currentImages.splice(index, 1);
    if (currentImages.length > 0) {
      form.setValue("images", currentImages as [string, ...string[]]);
    }
  };

  // =============== Delete Product =================
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4  ">
        <Stepper currentStep={step} totalSteps={totalSteps} className="mb-3" />

        {/* Basic Information Section */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide the essential details about your product.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4  overflow-y-scroll max-h-80">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required-input">
                        Product Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required-input">
                        Price (USD)
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1.5 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="pl-7"
                            {...field}
                            min={0}
                            step={0.01}
                            value={field.value > 0 ? field.value : ""}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priceAfterDiscount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price after discount (USD)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1.5 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="pl-7"
                            {...field}
                            min={0}
                            step={0.01}
                            value={field.value ?? ""}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required-input">Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          min={0}
                          value={field.value > 0 ? field.value : ""}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={ProductStatus.ACTIVE}>
                            Active
                          </SelectItem>
                          <SelectItem value={ProductStatus.OUT_OF_STOCK}>
                            Out of Stock
                          </SelectItem>
                          <SelectItem value={ProductStatus.DISCONTINUED}>
                            Discontinued
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="required-input">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Describe your product in detail..."
                        className="min-h-28"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        {/* Images Section */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>
                Upload high-quality images of your product.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 overflow-y-scroll max-h-80">
              <FormField
                control={form.control}
                name="imageCover"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="required-input">
                      Cover Image
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {field.value ? (
                          <div className="relative aspect-square w-full max-w-56 rounded-md overflow-hidden border">
                            <Image
                              src={field.value}
                              alt="Cover"
                              className="object-cover w-full h-full"
                              fill
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8"
                              onClick={() => form.setValue("imageCover", "")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center border border-dashed rounded-md h-56 w-full max-w-56">
                            <Label className="cursor-pointer flex flex-col items-center justify-center w-full h-full hover:bg-muted/50 transition-colors">
                              <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                              <span className="text-sm text-muted-foreground">
                                Upload cover image
                              </span>
                              <Input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCoverImageUpload}
                              />
                            </Label>
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          This will be the main image displayed for your product
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="required-input">
                      Additional Images
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {field.value
                            .filter((image) => image !== null)
                            .map((image, index) => (
                              <div
                                key={index}
                                className="relative aspect-square rounded-md w-full max-w-56 overflow-hidden border"
                              >
                                <Image
                                  src={image as string}
                                  alt={`Product ${index}`}
                                  className="object-cover w-full h-full"
                                  fill
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-7 w-7"
                                  onClick={() => removeImage(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}

                          <div className="aspect-square rounded-md border border-dashed flex flex-col items-center justify-center p-4 hover:bg-muted/50 w-full max-w-56 cursor-pointer transition-colors">
                            <Label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                              <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                              <span className="text-sm text-muted-foreground text-center">
                                Add
                              </span>
                              <Input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleProductImagesUpload}
                              />
                            </Label>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Upload multiple images to showcase different angles of
                          your product
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        {/* Classification Section */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Classification</CardTitle>
              <CardDescription>
                Categorize your product for better searchability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required-input">Category</FormLabel>
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) =>
                          handleCategoryChange(Number(value))
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subCategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategory</FormLabel>
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) => field.onChange(Number(value))}
                        disabled={
                          !selectedCategory ||
                          subcategories.length === 0 ||
                          subcategoriesByCategory.length === 0
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subcategoriesByCategory.map((subcategory) => (
                            <SelectItem
                              key={subcategory.id}
                              value={subcategory.id.toString()}
                            >
                              {subcategory.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brandId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem
                              key={brand.id}
                              value={brand.id.toString()}
                            >
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Colors Section */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
              <CardDescription>
                Specify available color options for your product.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="colors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colors</FormLabel>
                    <FormControl>
                      <ColorPicker
                        colors={field.value || []}
                        onChange={(newColors) => {
                          field.onChange(newColors);
                          form.trigger("colors");
                        }}
                        error={form.formState.errors.colors?.message}
                      />
                    </FormControl>
                    <FormDescription>
                      Add all available color options
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        {/* Physical Attributes Section */}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Physical Attributes</CardTitle>
              <CardDescription>
                Provide details about the physical characteristics of your
                product.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-end  gap-4">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="flex items-center gap-1">
                        <Weight className="h-4 w-4" />
                        Weight (Kg)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          min={0}
                          step={0.01}
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value
                              ? parseFloat(e.target.value)
                              : undefined;
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>Weight in Kilogram (Kg)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="warranty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 1 year" {...field} />
                    </FormControl>
                    <FormDescription>
                      Format: &quot;1 year&quot;, &quot;6 months&quot;, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="flex items-center gap-1 mb-2">
                  <IconsDimensions className="h-4 w-4" />
                  Dimensions (cm)
                </FormLabel>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="dimensions.length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Length</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            min={0}
                            step={0.1}
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value
                                ? parseFloat(e.target.value)
                                : 0;
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dimensions.width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Width</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            min={0}
                            step={0.1}
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value
                                ? parseFloat(e.target.value)
                                : 0;
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dimensions.height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Height</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            min={0}
                            step={0.1}
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = e.target.value
                                ? parseFloat(e.target.value)
                                : 0;
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  All measurements in centimeters (cm)
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
          ) : (
            <div></div> // Empty div to maintain flex spacing
          )}

          {step < totalSteps ? (
            <Button type="button" onClick={nextStep} className="gap-1">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
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
                  ? "Create Product"
                  : "Save Changes"}
              </Button>
            </DialogFooter>
          )}
        </div>
      </form>
    </Form>
  );
}
