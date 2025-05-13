"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiGetProduct } from "@/lib/api/product";
import { ProductStatus } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Package,
  Ruler,
  Star,
  Tag,
  Weight,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import React, { useState } from "react";
import { toast } from "sonner";

const ProductStatusBadge: React.FC<{ status: ProductStatus }> = ({
  status,
}) => {
  switch (status) {
    case ProductStatus.ACTIVE:
      return <Badge className="bg-green-500">{status}</Badge>;
    case ProductStatus.OUT_OF_STOCK:
      return (
        <Badge variant="outline" className="text-amber-500 border-amber-500">
          Out of Stock
        </Badge>
      );
    case ProductStatus.DISCONTINUED:
      return <Badge variant="destructive">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};
export default function ProductDetails({ id }: { id: string }) {
  const { data, isError, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => apiGetProduct(id),
    staleTime: 60 * 1000, // 1 minute stale time
    retry: 2, // Retry twice before failing
    retryDelay: 1000, // 1 second between retries
  });
  if (isError) {
    toast.error("Failed to fetch product", {
      description: error?.message || "Please try again later",
    });
  }
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!data) {
    return <div>Loading...</div>;
  }
  const product = data;

  return (
    <div>
      <div className="flex items-center mb-8">
        <Link href="/products">
          <Button variant="outline" size="icon" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>ID: {product.id}</span>
            <span>•</span>
            <ProductStatusBadge status={product.status} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Product Images */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="mb-4 aspect-square bg-slate-50 rounded-md overflow-hidden flex items-center justify-center">
              <Image
                src={product.images[activeImageIndex] || product.imageCover}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
                width={240}
                height={240}
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setActiveImageIndex(-1)}
                className={`aspect-square bg-slate-50 rounded-md overflow-hidden cursor-pointer flex items-center justify-center ${
                  activeImageIndex === -1 ? "ring-2 ring-primary" : ""
                }`}
              >
                <Image
                  src={product.imageCover}
                  alt={`${product.name} cover`}
                  className="max-h-full max-w-full object-contain"
                  width={100}
                  height={100}
                />
              </button>
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`aspect-square cursor-pointer bg-slate-50 rounded-md overflow-hidden flex items-center justify-center ${
                    activeImageIndex === index ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="max-h-full max-w-full object-contain"
                    width={100}
                    height={100}
                  />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <div className="md:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1 cursor-pointer">
                Details
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="flex-1 cursor-pointer"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger value="ratings" className="flex-1 cursor-pointer">
                Ratings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Description
                    </h3>
                    <p>{product.description}</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Price
                      </h3>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold">
                          ${product.priceAfterDiscount || product.price}
                        </span>
                        {product.priceAfterDiscount && (
                          <span className="ml-2 text-muted-foreground line-through">
                            ${product.price}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Inventory
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{product.quantity}</span>
                        <span className="text-sm text-muted-foreground">
                          in stock
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Category
                      </h3>
                      <div>
                        <div>{product.category.name}</div>
                      </div>
                    </div>

                    {product.subCategory && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Subcategory
                        </h3>
                        <div>{product.subCategory.name}</div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Brand
                      </h3>
                      <div>{product.brand?.name || "N/A"}</div>
                    </div>
                  </div>



                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Created
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(new Date(product.createAt))}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Last Updated
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(new Date(product.updatedAt))}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Weight
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Weight className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {product.weight ? `${product.weight} kg` : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Warranty
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span>{product.warranty || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Dimensions
                      </h3>
                      {product.dimensions ? (
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <span className="text-xs text-muted-foreground">
                              Length
                            </span>
                            <div className="flex items-center space-x-1">
                              <Ruler className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {product.dimensions.length || "N/A"} cm
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">
                              Width
                            </span>
                            <div className="flex items-center space-x-1">
                              <Ruler className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {product.dimensions.width || "N/A"} cm
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">
                              Height
                            </span>
                            <div className="flex items-center space-x-1">
                              <Ruler className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {product.dimensions.height || "N/A"} cm
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span>No dimension data available</span>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Stock Status
                      </h3>
                      <div className="flex items-center space-x-2">
                        {product.status === ProductStatus.ACTIVE ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>In Stock ({product.quantity} available)</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span>
                              {product.status === ProductStatus.OUT_OF_STOCK
                                ? "Out of Stock"
                                : product.status}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Sales Performance
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-muted-foreground">
                            Units Sold
                          </span>
                          <div className="font-medium">{product.sold}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ratings" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Ratings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
                    <div className="flex flex-col items-center mb-6 md:mb-0">
                      <div className="text-5xl font-bold">
                        {product.ratingsAverage}
                      </div>
                      <div className="flex items-center space-x-1 my-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              parseFloat(product.ratingsAverage) >= star
                                ? "text-yellow-400 fill-yellow-400"
                                : parseFloat(product.ratingsAverage) >=
                                  star - 0.5
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Based on {product.ratingsQuantity} reviews
                      </div>
                    </div>

                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div
                          key={rating}
                          className="flex items-center space-x-2 mb-2"
                        >
                          <div className="flex items-center w-12">
                            <span>{rating}</span>
                            <Star className="h-4 w-4 ml-1 text-yellow-400" />
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                            <div
                              className="absolute top-0 left-0 h-full bg-yellow-400 rounded-full"
                              style={{
                                width: `${
                                  rating ===
                                  Math.round(parseFloat(product.ratingsAverage))
                                    ? "60%"
                                    : rating >
                                      Math.round(
                                        parseFloat(product.ratingsAverage)
                                      )
                                    ? "15%"
                                    : "30%"
                                }`,
                              }}
                            />
                          </div>
                          <div className="w-12 text-right text-sm text-muted-foreground">
                            {rating ===
                            Math.round(parseFloat(product.ratingsAverage))
                              ? Math.round(product.ratingsQuantity * 0.6)
                              : rating >
                                Math.round(parseFloat(product.ratingsAverage))
                              ? Math.round(product.ratingsQuantity * 0.15)
                              : Math.round(product.ratingsQuantity * 0.3)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
