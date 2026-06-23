"use server";

import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { setToken, clearToken } from "@/lib/session";

export async function loginAction(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Email and password are required." };

  try {
    const { token } = await api.login(email, password);
    await setToken(token);
  } catch (e) {
    if (e instanceof ApiError) return { error: e.message };
    return { error: "Unexpected error. Please try again." };
  }

  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await clearToken();
  redirect("/login");
}
