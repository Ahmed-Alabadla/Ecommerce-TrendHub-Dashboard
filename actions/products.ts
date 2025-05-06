"use server";
import { PaginatedProducts, ProductQueryParams } from "@/types/product";
import { cookies } from "next/headers";

export const getProducts = async (
  params: ProductQueryParams = {}
): Promise<PaginatedProducts> => {
  const { page = 1, limit = 10 } = params;

  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token")?.value;

  if (!token) throw new Error("No access token found");

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    includeInactive: "true",
  });

  try {
    const res = await fetch(
      `${process.env.API_URL}/products?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        next: {
          tags: ["products"],
        },
      }
    );

    const response = await res.json();

    if (!res.ok) {
      if (Array.isArray(response.message)) {
        throw new Error(response.message.join(", "));
      }
      throw new Error(response.message || "Failed to fetch products");
    }

    return response;
  } catch (error) {
    console.error("Fetch products error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch products"
    );
  }
};
