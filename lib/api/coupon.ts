import { Coupon, CreateCouponDto } from "@/types/coupon";
import { getCookie } from "cookies-next/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiGetCoupons = async (): Promise<Coupon[]> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/coupons`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch coupons");
  }
  const response = await res.json();

  return response;
};

export const apiCreateCoupon = async (
  data: CreateCouponDto
): Promise<Coupon> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/coupons`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to create coupon");
  }

  const response = await res.json();

  return response;
};

export const apiUpdateCoupon = async (
  id: number,
  data: Partial<CreateCouponDto>
): Promise<Coupon> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/coupons/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to update coupon");
  }

  const response = await res.json();

  return response;
};

export const apiDeleteCoupon = async (id: number): Promise<void> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }
  const res = await fetch(`${API_URL}/coupons/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete coupon");
  }
};
