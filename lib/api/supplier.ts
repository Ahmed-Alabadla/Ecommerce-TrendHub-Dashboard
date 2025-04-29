import { CreateSupplierDto, Supplier } from "@/types/supplier";
import { getCookie } from "cookies-next/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiGetSuppliers = async (): Promise<Supplier[]> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/suppliers`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch suppliers");
  }
  const response = await res.json();

  return response;
};

export const apiCreateSupplier = async (
  data: CreateSupplierDto
): Promise<Supplier> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/suppliers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to create Supplier");
  }

  const response = await res.json();

  return response;
};

export const apiUpdateSupplier = async (
  id: number,
  data: Partial<CreateSupplierDto>
): Promise<Supplier> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/suppliers/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to update Supplier");
  }

  const response = await res.json();

  return response;
};

export const apiDeleteSupplier = async (id: number): Promise<void> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }
  const res = await fetch(`${API_URL}/suppliers/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete Supplier");
  }
};
