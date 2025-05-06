import { getCookie } from "cookies-next/client";

import {
  CreateProductDto,
  PaginatedProducts,
  Product,
  ProductQueryParams,
} from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiGetProducts = async (
  params: ProductQueryParams = {}
): Promise<PaginatedProducts> => {
  const { page = 1, limit = 10 } = params;

  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());

  try {
    const res = await fetch(
      `${API_URL}/products?includeInactive=true&${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.message || "Failed to fetch products with unknown error"
      );
    }

    return await res.json();
  } catch (error) {
    console.error("API fetch error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch products"
    );
  }
};

export const apiCreateProduct = async (
  data: CreateProductDto
): Promise<Product> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to create product");
  }

  const response = await res.json();

  return response;
};

export const apiUpdateProduct = async (
  id: number,
  data: Partial<Product>
): Promise<Product> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to update product");
  }
  const response = await res.json();

  return response;
};

export const apiDeleteProduct = async (id: number): Promise<void> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete product");
  }
};
