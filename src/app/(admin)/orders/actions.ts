"use server";

import { revalidatePath } from "next/cache";
import { api, ApiError } from "@/lib/api";

export async function updateOrderStatus(
  id: string,
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; ok?: boolean }> {
  const status = String(formData.get("status") ?? "");
  try {
    await api.updateOrderStatus(id, status);
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Failed to update status." };
  }
  revalidatePath(`/orders/${id}`);
  revalidatePath("/orders");
  return { ok: true };
}

export async function deleteOrder(id: string): Promise<{ error?: string } | void> {
  try {
    await api.deleteOrder(id);
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Failed to delete order." };
  }
  revalidatePath("/orders");
}
