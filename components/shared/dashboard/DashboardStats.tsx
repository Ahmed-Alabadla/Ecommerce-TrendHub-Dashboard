"use client";
import React from "react";
import StatCard from "./StatCard";

import {
  ArrowUpRight,
  ShoppingCart,
  Package,
  Users,
  FolderOpen,
  Folders,
  Tag,
  Percent,
  Truck,
} from "lucide-react";
import { apiDashboardStats } from "@/lib/api/dashboard";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
export default function DashboardStats() {
  const { data, isError, error, isPending, refetch } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: apiDashboardStats,
    staleTime: 60 * 1000, // 1 minute stale time
    retry: 2, // Retry twice before failing
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    // Enable background refetching for better UX
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  if (isError) {
    toast.error("Failed to fetch dashboard stats", {
      description: error?.message || "Please try again later",
      action: {
        label: "Retry",
        onClick: () => refetch(),
      },
    });
  }
  if (isPending || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="p-6 border rounded-lg">
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      <StatCard
        title="Total Revenue"
        value={`$${data.totalRevenue.toLocaleString()}`}
        icon={ArrowUpRight}
        description="vs. previous month"
      />
      <StatCard
        title="Orders"
        value={data.totalOrders.toLocaleString()}
        icon={ShoppingCart}
        description="vs. previous month"
      />
      <StatCard
        title="Products"
        value={data.totalProducts.toLocaleString()}
        icon={Package}
        description="All products in your store"
      />
      <StatCard
        title="Users"
        value={data.totalUsers.toLocaleString()}
        icon={Users}
        description="vs. previous month"
      />
      <StatCard
        title="Categories"
        value={data.totalCategories.toLocaleString()}
        icon={FolderOpen}
        description="All categories in your store"
      />
      <StatCard
        title="Sub Categories"
        value={data.totalSubCategories.toLocaleString()}
        icon={Folders}
        description="All sub categories in your store"
      />
      <StatCard
        title="Brands"
        value={data.totalBrands.toLocaleString()}
        icon={Tag}
        description="All brands in your store"
      />
      <StatCard
        title="Carts"
        value={data.totalCarts.toLocaleString()}
        icon={ShoppingCart}
        description="Total carts created"
      />
      <StatCard
        title="Coupons"
        value={data.totalCoupons.toLocaleString()}
        icon={Percent}
        description="Total coupons available"
      />
      <StatCard
        title="Suppliers"
        value={data.totalSuppliers.toLocaleString()}
        icon={Truck}
        description="Total suppliers registered"
      />
    </div>
  );
}
