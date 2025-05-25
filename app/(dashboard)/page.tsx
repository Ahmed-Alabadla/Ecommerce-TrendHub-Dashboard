import DashboardStats from "@/components/shared/dashboard/DashboardStats";
import RecentOrders from "@/components/shared/dashboard/RecentOrders";
import SalesChart from "@/components/shared/dashboard/SalesChart";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your store's performance",
};
export default async function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your store&apos;s performance
        </p>
      </div>

      <DashboardStats />

      <SalesChart />

      <RecentOrders />
    </div>
  );
}
