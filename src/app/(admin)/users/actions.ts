"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";

export async function deleteUser(id: string): Promise<{ error?: string } | void> {
  try {
    await api.deleteUser(id);
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Failed to delete user." };
  }
  revalidatePath("/users");
}

export async function deleteUserAndReturn(id: string): Promise<{ error?: string } | void> {
  try {
    await api.deleteUser(id);
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Failed to delete user." };
  }
  revalidatePath("/users");
  redirect("/users");
}
