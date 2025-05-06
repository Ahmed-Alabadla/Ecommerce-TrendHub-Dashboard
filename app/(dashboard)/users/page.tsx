import UsersClient from "./UsersClient";
import { queryClient } from "@/lib/react-query/client";
import { getUsers } from "@/actions/users";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description: "Manage users in the system",
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const {
    page = "1",
    limit = "10",
    email = "",
    name = "",
  } = await searchParams;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  // Clear any existing user queries to prevent cache interference
  queryClient.removeQueries({
    queryKey: ["users"],
    exact: false,
  });

  // Prefetch with consistent query key structure
  await queryClient.prefetchQuery({
    queryKey: ["users", { page: pageNumber, limit: limitNumber, email, name }],
    queryFn: () =>
      getUsers({ page: pageNumber, limit: limitNumber, email, name }),
    staleTime: 60 * 1000, // 1 minute stale time
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersClient
        searchParams={{ page: pageNumber, limit: limitNumber, email, name }}
      />
    </HydrationBoundary>
  );
}
