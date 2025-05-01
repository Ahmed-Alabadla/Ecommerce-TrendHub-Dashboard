"use server";
import { Review } from "@/types/review";
import { cookies } from "next/headers";

export const getReviews = async (): Promise<Review[]> => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token")?.value;

  if (!token) throw new Error("No access token found");

  try {
    const res = await fetch(`${process.env.API_URL}/reviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
