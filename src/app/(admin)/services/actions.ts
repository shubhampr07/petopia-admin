"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";

function bodyFromForm(formData: FormData) {
  const pSmall  = formData.get("pricingSmall")  ? parseFloat(String(formData.get("pricingSmall")))  : null;
  const pMedium = formData.get("pricingMedium") ? parseFloat(String(formData.get("pricingMedium"))) : null;
  const pLarge  = formData.get("pricingLarge")  ? parseFloat(String(formData.get("pricingLarge")))  : null;
  return {
    name:         String(formData.get("name")         ?? "").trim(),
    category:     String(formData.get("category")     ?? "Grooming packages").trim(),
    durationMin:  parseInt(String(formData.get("durationMin") ?? "60"), 10) || 60,
    price:        parseFloat(String(formData.get("price") ?? "0")) || 0,
    pricingSmall:  isNaN(pSmall  as number) ? null : pSmall,
    pricingMedium: isNaN(pMedium as number) ? null : pMedium,
    pricingLarge:  isNaN(pLarge  as number) ? null : pLarge,
    includes:     String(formData.get("includes")     ?? "").trim() || null,
    sessions:     String(formData.get("sessions")     ?? "").trim() || null,
    locationNote: String(formData.get("locationNote") ?? "").trim() || null,
    isActive:     formData.get("isActive") === "true",
    sortOrder:    parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0,
  };
}

export async function createBookingService(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  try {
    await api.createBookingService(bodyFromForm(formData));
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Failed to create service." };
  }
  revalidatePath("/services");
  redirect("/services");
}

export async function updateBookingService(
  id: string,
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  try {
    await api.updateBookingService(id, bodyFromForm(formData));
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Failed to update service." };
  }
  revalidatePath("/services");
  redirect("/services");
}

export async function deleteBookingService(id: string): Promise<{ error?: string } | void> {
  try {
    await api.deleteBookingService(id);
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Failed to delete service." };
  }
  revalidatePath("/services");
}
