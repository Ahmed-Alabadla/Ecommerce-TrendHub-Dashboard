import { CreateSubCategoryDto, SubCategory } from "@/types/subCategory";
import { getCookie } from "cookies-next/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiGetSubCategories = async (): Promise<SubCategory[]> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/sub-categories`, {
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

export const apiCreateSubCategory = async (
  data: CreateSubCategoryDto
): Promise<SubCategory> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/sub-categories`, {
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
    const err = await res.json();

    const message =
      typeof err.message === "object" ? err.message[0] : err.message;
    throw new Error(message);
  }

  const response = await res.json();

  return response;
};

export const apiUpdateSubCategory = async (
  id: number,
  data: Partial<CreateSubCategoryDto>
): Promise<SubCategory> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/sub-categories/${id}`, {
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
    const err = await res.json();

    const message =
      typeof err.message === "object" ? err.message[0] : err.message;
    throw new Error(message);
  }
  const response = await res.json();

  return response;
};

export const apiDeleteSubCategory = async (id: number): Promise<void> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }
  const res = await fetch(`${API_URL}/sub-categories/${id}`, {
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
