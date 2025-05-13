import { Category, CreateCategoryDto } from "@/types/category";
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
    const err = await res.json();

    const message =
      typeof err.message === "object" ? err.message[0] : err.message;
    throw new Error(message);
  }

  const response = await res.json();

  return response;
};

export const apiCreateCategory = async (
  data: CreateCategoryDto
): Promise<Category> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const formData = new FormData();
  const { name, slug, image } = data;
  formData.append("name", name);
  formData.append("slug", slug.toLowerCase());
  if (image) formData.append("image", image);

  const res = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formData,
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

export const apiUpdateCategory = async (
  id: number,
  data: Partial<CreateCategoryDto>
): Promise<Category> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const formData = new FormData();
  const { name, slug, image } = data;
  if (name) formData.append("name", name);
  if (slug) formData.append("slug", slug.toLowerCase());
  if (image) formData.append("image", image);

  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formData,
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
    const err = await res.json();

    const message =
      typeof err.message === "object" ? err.message[0] : err.message;
    throw new Error(message);
  }
};
