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

export async function adjustPawPointsAction(
  userId: string,
  _prev: { error?: string; ok?: boolean; balance?: number } | null,
  formData: FormData,
): Promise<{ error?: string; ok?: boolean; balance?: number }> {
  const delta = Number(formData.get("delta"));
  const reason = String(formData.get("reason") ?? "").trim();
  if (!Number.isFinite(delta) || delta === 0) {
    return { error: "Enter a non-zero point adjustment." };
  }
  try {
    const res = await api.adjustUserPawPoints(userId, Math.trunc(delta), reason || undefined);
    revalidatePath(`/users/${userId}`);
    revalidatePath("/users");
    return { ok: true, balance: res.balance };
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Adjustment failed." };
  }
}
