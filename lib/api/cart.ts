import { Cart } from "@/types/cart";
import { getCookie } from "cookies-next/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiGetCarts = async (): Promise<Cart[]> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/cart/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch carts");
  }
  const response = await res.json();

  return response;
};
