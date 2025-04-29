import { Brand, CreateBrandDto } from "@/types/brand";
import { getCookie } from "cookies-next/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiGetBrands = async (): Promise<Brand[]> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/brands`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch brands");
  }
  const response = await res.json();

  return response;
};

export const apiCreateBrand = async (data: CreateBrandDto): Promise<Brand> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/brands`, {
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
    throw new Error(errorData?.message || "Failed to create brand");
  }

  const response = await res.json();

  return response;
};

export const apiUpdateBrand = async (
  id: number,
  data: Partial<CreateBrandDto>
): Promise<Brand> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/brands/${id}`, {
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
    throw new Error(errorData?.message || "Failed to update brand");
  }

  const response = await res.json();

  return response;
};

export const apiDeleteBrand = async (id: number): Promise<void> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }
  const res = await fetch(`${API_URL}/brands/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete brand");
  }
};
