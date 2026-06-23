"use server";

import { revalidatePath } from "next/cache";
import { api, ApiError } from "@/lib/api";

export async function updateInquiryStatus(id: string, status: string): Promise<{ error?: string } | void> {
  try {
    await api.updateInquiryStatus(id, status);
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Failed to update status." };
  }
  revalidatePath("/adoption-inquiries");
  revalidatePath(`/adoption-inquiries/${id}`);
}

export async function deleteInquiry(id: string): Promise<{ error?: string } | void> {
  try {
    await api.deleteAdoptionInquiry(id);
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Failed to delete inquiry." };
  }
  revalidatePath("/adoption-inquiries");
}
