"use client";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Folder,
  ShoppingCart,
  Users,
  UserRound,
  BarChart,
  Settings,
  LogOut,
  MessageSquare,
  Percent,
  Truck,
  Tag,
  BadgePercent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

import logo from "@/public/logo.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    path: "/products",
    icon: Package,
  },
  {
    title: "Categories",
    path: "/categories",
    icon: FolderOpen,
  },
  {
    title: "Subcategories",
    path: "/subcategories",
    icon: Folder,
  },
  {
    title: "Brands",
    path: "/brands",
    icon: Tag,
  },
  {
    title: "Orders",
    path: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    path: "/customers",
    icon: Users,
  },
  {
    title: "Users",
    path: "/users?page=1&limit=10&name=&email=",
    icon: UserRound,
  },
  {
    title: "Reviews",
    path: "/reviews",
    icon: MessageSquare,
  },
  {
    title: "Coupons",
    path: "/coupons",
    icon: Percent,
  },
  {
    title: "Suppliers",
    path: "/suppliers",
    icon: Truck,
  },
  {
    title: "Taxes",
    path: "/taxes",
    icon: BadgePercent,
  },
  {
    title: "Analytics",
    path: "/analytics",
    icon: BarChart,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="h-16 flex items-center px-4 border-b">
        <div className="flex items-center justify-center w-full">
          <Link href="/" className="flex items-center justify-center">
            <Image src={logo} alt="logo" width={156} />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-1">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.slice(0, 5).map((item) => (
                <SidebarMenuItem key={item.path}>
                  <Link
                    href={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md w-full text-sm font-medium",
                      pathname === item.path
                        ? "bg-primary text-white"
                        : "hover:bg-primary/10 dark:hover:bg-primary/30"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-1">
            Sales & Customers
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.slice(5, 8).map((item) => (
                <SidebarMenuItem key={item.path}>
                  <Link
                    href={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md w-full text-sm font-medium",
                      pathname === item.path
                        ? "bg-primary text-white"
                        : "hover:bg-primary/10 dark:hover:bg-primary/30"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-1">
            Marketing & Finance
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.slice(8, 12).map((item) => (
                <SidebarMenuItem key={item.path}>
                  <Link
                    href={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md w-full text-sm font-medium",
                      pathname === item.path
                        ? "bg-primary text-white"
                        : "hover:bg-primary/10 dark:hover:bg-primary/30"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-1">System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.slice(12).map((item) => (
                <SidebarMenuItem key={item.path}>
                  <Link
                    href={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md w-full text-sm font-medium",
                      pathname === item.path
                        ? "bg-primary text-white"
                        : "hover:bg-primary/10 dark:hover:bg-primary/30"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto px-3 py-2 mb-4">
          <Button
            size="lg"
            variant="ghost"
            className="w-full hover:bg-primary/10 dark:hover:bg-primary/30 "
          >
            <LogOut className="h-5 w-5 text-red-500" />
            <span>Logout</span>
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
