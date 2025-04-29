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
    throw new Error("Failed to fetch profile");
  }

  const data = await res.json();

  return data;
};
