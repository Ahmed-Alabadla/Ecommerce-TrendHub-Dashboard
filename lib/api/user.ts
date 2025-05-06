import { getCookie } from "cookies-next/client";
import { PaginatedUsers, User, UserQueryParams } from "@/types/user";
import { generateRandomPassword } from "../utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiGetUsers = async (
  params: UserQueryParams = {}
): Promise<PaginatedUsers> => {
  const { page = 1, limit = 10, name, email } = params;

  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }
  const query = new URLSearchParams();
  query.append("page", page.toString());
  query.append("limit", limit.toString());

  if (name) query.append("name", name);
  if (email) query.append("email", email);

  const res = await fetch(`${API_URL}/admin/users?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  const response = await res.json();

  return response;
};

export const apiCreateUser = async (
  userData: Omit<User, "id" | "createAt" | "updatedAt" | "isAccountVerified">
): Promise<User> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const password = generateRandomPassword();

  const res = await fetch(`${API_URL}/admin/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...userData,
      password,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to create user");
  }

  const response = await res.json();

  return response;
};

export const apiUpdateUser = async (
  id: number,
  userData: Partial<User>
): Promise<User> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${API_URL}/admin/users/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to update user");
  }
  const response = await res.json();

  return response;
};

export const apiDeleteUser = async (id: number): Promise<void> => {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No access token found");
  }
  const res = await fetch(`${API_URL}/admin/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }
};
