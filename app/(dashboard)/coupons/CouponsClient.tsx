"use client";

import { DialogWrapper } from "@/components/shared/dashboard/DialogWrapper";
import { DataTable } from "@/components/shared/dashboard/table/DataTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { columns } from "./columns";

import { toast } from "sonner";
import { useCoupons } from "@/hooks/use-coupons";
import CouponForm from "@/components/shared/dashboard/CouponForm";

export default function CouponsClient() {
  const { data, error, isError, isPending } = useCoupons();

  if (isError) {
    toast.error(error?.message as string, {
      description: "Failed to fetch coupons",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Coupons</h2>
          <p className="text-muted-foreground">
            Manage your store&apos;s discount coupons and promotional offers
          </p>
        </div>

        <DialogWrapper
          title="Add New Coupon"
          description="Create a new discount coupon for your store"
          dialogTrigger={
            <Button variant="default">
              <Plus className="h-4 w-4" />
              <span>Add Coupon</span>
            </Button>
          }
        >
          <CouponForm type="create" />
        </DialogWrapper>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Coupons</CardTitle>
          <CardDescription>Showing {data.length} Coupons</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} loading={isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
