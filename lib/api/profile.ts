import { ChangePasswordDto, UpdateProfileDto } from "@/types/user";
import { getCookie } from "cookies-next/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiProfile = async () => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  });

  if (!res.ok) {
    const err = await res.json();

    const message =
      typeof err.message === "object" ? err.message[0] : err.message;
    throw new Error(message);
  }

  const data = await res.json();

  return data;
};

export const apiUpdateProfile = async (data: UpdateProfileDto) => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const formData = new FormData();
  const { name, phone, avatar, address, birth_date, gender } = data;

  if (name) formData.append("name", name);
  if (phone) formData.append("phone", phone);
  if (avatar) formData.append("avatar", avatar);
  if (address) formData.append("address", address);
  if (gender) formData.append("gender", gender);

  if (birth_date) {
    const date = new Date(birth_date);
    // date.setDate(date.getDate() + 1); // Add one day
    const formattedExpireDate = date.toLocaleString();
    formData.append("birth_date", formattedExpireDate);
  }

  const res = await fetch(`${API_URL}/users/profile`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      // "Content-Type": "application/json",
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

export const apiChangePassword = async (data: ChangePasswordDto) => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/auth/change-password`, {
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
