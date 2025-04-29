"use server";
import { PaginatedUsers, UserQueryParams } from "@/types/user";
import { cookies } from "next/headers";

export const getUsers = async (
  params: UserQueryParams = {}
): Promise<PaginatedUsers> => {
  const { page = 1, limit = 10, name, email } = params;

  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token")?.value;

  if (!token) throw new Error("No access token found");

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (name) params.append("name", name);
    if (email) params.append("email", email);

    const res = await fetch(
      `${process.env.API_URL}/admin/users?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        // next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );
    //
    const response = await res.json();

    if (!res.ok) {
      if (typeof response.message === "object") {
        throw new Error(response.message[0]);
      }
      throw new Error(response.message);
    }

    return response;
  } catch {
    throw new Error("Failed to fetch users");
  }
};
