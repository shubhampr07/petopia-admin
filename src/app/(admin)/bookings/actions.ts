"use server";

import { revalidatePath } from "next/cache";
import { api, ApiError } from "@/lib/api";

export async function deleteBooking(id: string): Promise<{ error?: string } | void> {
  try {
    await api.deleteBooking(id);
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Failed to delete booking." };
  }
  revalidatePath("/bookings");
}
