import { Category } from "@/types/category";
import { getCookie } from "cookies-next/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiGetCategories = async (): Promise<Category[]> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  const response = await res.json();

  return response;
};

export const apiCreateCategory = async (
  data: Omit<Category, "id" | "createAt" | "updatedAt" | "subCategories">
): Promise<Category> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      slug: data.slug.toLowerCase(),
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to create category");
  }

  const response = await res.json();

  return response;
};

export const apiUpdateCategory = async (
  id: number,
  data: Partial<Category>
): Promise<Category> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      slug: data.slug?.toLocaleLowerCase(),
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to update category");
  }

  const response = await res.json();

  return response;
};

export const apiDeleteCategory = async (id: number): Promise<void> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete category");
  }
};
