"use server";
import { PaginatedReviews, ReviewQueryParams } from "@/types/review";
import { cookies } from "next/headers";

export const getReviews = async (
  params: ReviewQueryParams = {}
): Promise<PaginatedReviews> => {
  const { page = 1, limit = 10 } = params;

  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token")?.value;

  if (!token) throw new Error("No access token found");

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const res = await fetch(
      `${process.env.API_URL}/reviews?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const response = await res.json();

    if (!res.ok) {
      if (typeof response.message === "object")
        throw new Error(response.message[0]);

      throw new Error(response.message);
    }

    return response;
  } catch {
    throw new Error("Failed to fetch reviews");
  }
};
