import AppSidebar from "@/components/shared/dashboard/AppSidebar";
import Header from "@/components/shared/dashboard/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";
import Loading from "../loading";
import { queryClient } from "@/lib/react-query/client";
import { profile } from "@/actions/auth";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { User } from "@/types/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token")?.value;
  if (!token) {
    redirect("/auth/login");
  }
  await queryClient.prefetchQuery<User>({
    queryKey: ["profile"],
    queryFn: () => profile(),
    staleTime: Infinity, // never becomes stale
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)} key={`profile`}>
      <SidebarProvider>
        {/* <UserInitializer user={user} /> */}
        <div className="min-h-screen flex w-full">
          <AppSidebar />

          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <Suspense fallback={<Loading />}>
              <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                {children}
              </main>
            </Suspense>
          </div>
        </div>
      </SidebarProvider>
    </HydrationBoundary>
  );
}
