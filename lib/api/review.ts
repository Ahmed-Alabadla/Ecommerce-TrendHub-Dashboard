import { PaginatedReviews, ReviewQueryParams } from "@/types/review";
import { getCookie } from "cookies-next/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiGetReviews = async (
  params: ReviewQueryParams = {}
): Promise<PaginatedReviews> => {
  const { page = 1, limit = 10 } = params;

  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const query = new URLSearchParams();
  query.append("page", page.toString());
  query.append("limit", limit.toString());

  const res = await fetch(`${API_URL}/reviews?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json();

    const message =
      typeof err.message === "object" ? err.message[0] : err.message;
    throw new Error(message);
  }
  const response = await res.json();

  return response;
};

export const apiDeleteReview = async (id: number): Promise<void> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }
  const res = await fetch(`${API_URL}/reviews/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();

    const message =
      typeof err.message === "object" ? err.message[0] : err.message;
    throw new Error(message);
  }
};
