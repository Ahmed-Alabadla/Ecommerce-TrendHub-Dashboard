"use client";
import DataTablePaginate from "@/components/shared/dashboard/table/DataTablePaginate";
import { UserQueryParams } from "@/types/user";
import { columns } from "./columns";
import PaginationTable from "@/components/shared/dashboard/table/PaginationTable";
import { DialogWrapper } from "@/components/shared/dashboard/DialogWrapper";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import UserForm from "@/components/shared/dashboard/UserForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UsersFilters from "@/components/shared/dashboard/UsersFilters";
import { useSuspenseQuery } from "@tanstack/react-query";
import { apiGetUsers } from "@/lib/api/user";
import { toast } from "sonner";

export default function UsersClient({
  searchParams,
}: {
  searchParams: UserQueryParams;
}) {
  const { page = "1", limit = "10", email = "", name = "" } = searchParams;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const { data, isLoading, error } = useSuspenseQuery({
    queryKey: ["users", { page: pageNumber, limit: limitNumber, email, name }],
    queryFn: () =>
      apiGetUsers({ page: pageNumber, limit: limitNumber, email, name }),
    staleTime: 60 * 1000, // 1 minute stale time
    retry: 2, // Retry twice before failing
    retryDelay: 1000, // 1 second between retries
  });

  if (error) {
    toast.error(error.message as string, {
      description: "Failed to fetch users",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">Manage your user accounts</p>
        </div>

        <DialogWrapper
          title="Add New User"
          description="Create a new user account."
          dialogTrigger={
            <Button variant="default">
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </Button>
          }
        >
          <UserForm type="create" />
        </DialogWrapper>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage your system users and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersFilters />

          <DataTablePaginate
            columns={columns}
            data={data.data}
            loading={isLoading}
            currentPage={data.meta.current_page}
            totalItems={data.meta.total}
            itemsPerPage={data.meta.per_page}
          />

          <PaginationTable
            currentPage={data.meta.current_page}
            totalItems={data.meta.total}
            itemsPerPage={data.meta.per_page}
            lastPage={data.meta.last_page}
            className="mt-6"
          />
        </CardContent>
      </Card>
    </div>
  );
}
