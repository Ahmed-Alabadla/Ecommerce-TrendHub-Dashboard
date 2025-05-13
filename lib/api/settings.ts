import { CreateSettings, Settings } from "@/types/settings";
import { getCookie } from "cookies-next/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiGetSettings = async (): Promise<Settings> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/settings`, {
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

export const apiCreateSettings = async (
  data: CreateSettings
): Promise<Settings> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const {
    store_name,
    store_email,
    store_phone,
    store_address,
    store_logo,
    tax_rate,
    tax_enabled,
    shipping_rate,
    shipping_enabled,
  } = data;

  const formData = new FormData();
  if (store_name) formData.append("store_name", store_name);
  if (store_email) formData.append("store_email", store_email);
  if (store_phone) formData.append("store_phone", store_phone);
  if (store_logo) formData.append("store_logo", store_logo);
  if (store_address) formData.append("store_address", store_address);
  if (tax_rate) formData.append("tax_rate", tax_rate.toFixed(2));
  if (tax_enabled) formData.append("tax_enabled", "" + tax_enabled);
  if (shipping_rate) formData.append("shipping_rate", shipping_rate.toFixed(2));
  if (shipping_enabled)
    formData.append("shipping_enabled", "" + shipping_enabled);

  const res = await fetch(`${API_URL}/settings`, {
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
