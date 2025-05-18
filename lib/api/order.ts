import { Order } from "@/types/order";
import { getCookie } from "cookies-next/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiGetOrders = async (customerId: number): Promise<Order[]> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/order/checkout/${customerId}`, {
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

export const apiUpdateStatusOrder = async (
  id: number,
  data: { status: "paid" | "cancelled" }
): Promise<Order> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/order/checkout/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
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
