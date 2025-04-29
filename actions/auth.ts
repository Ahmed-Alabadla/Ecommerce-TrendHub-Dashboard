"use server";

import {
  ForgotPasswordSchema,
  LoginSchema,
  RegisterSchema,
  ResetPasswordSchema,
} from "@/schemas";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const res = await fetch(`${process.env.API_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const response = await res.json();

  if (res.ok && response?.message) {
    return { success: response.message };
  }

  if (!res.ok) {
    if (typeof response.message === "string") {
      return { error: response.message };
    }

    const err = response.message[0];
    return { error: err };
  }

  const { access_token } = response;

  // Set secure cookie
  const cookieStore = await cookies();
  cookieStore.set("access_token", access_token, {
    // httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  return { success: "Login successful!" };
};

export const registerAction = async (
  values: z.infer<typeof RegisterSchema>
) => {
  const data = {
    name: values.name,
    email: values.email,
    password: values.password,
  };
  const res = await fetch(`${process.env.API_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const response = await res.json();

  if (!res.ok) {
    if (typeof response.message === "string") {
      return { error: response.message };
    }

    const err = response.message[0];
    return { error: err };
  }

  if (res.ok && response?.message) {
    return { success: response.message };
  }
};

export const forgotPassword = async (
  values: z.infer<typeof ForgotPasswordSchema>
) => {
  const res = await fetch(`${process.env.API_URL}/auth/app/forgot-password`, {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const response = await res.json();

  if (!res.ok) {
    if (typeof response.message === "string") {
      return { error: response.message };
    }

    const err = response.message[0];
    return { error: err };
  }

  if (res.ok && response?.message) {
    return { success: response.message };
  }
};

export const resetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>,
  resetToken: string,
  userId: string
) => {
  const data = {
    userId: parseInt(userId),
    token: resetToken,
    newPassword: values.newPassword,
  };
  const res = await fetch(`${process.env.API_URL}/auth/reset-password`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const response = await res.json();

  if (!res.ok) {
    if (typeof response.message === "object") {
      return { error: response.message[0] };
    }

    const err = response.message;
    return { error: err };
  }

  if (res.ok && response?.message) {
    return { success: response.message };
  }
};

export const logout = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("access_token");

  return { success: "Logout successful!" };
};

export const profile = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  const profileRes = await fetch(`${process.env.API_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-cache",
  });
  if (!profileRes.ok) {
    redirect("/auth/login");
  }

  const user = await profileRes.json();

  if (user.role !== "admin") {
    redirect("https://ahmedalabadla.tech");
  }

  return user;
};
