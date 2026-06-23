"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";

function bodyFromForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim() || undefined,
    logo: String(formData.get("logo") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    featured: formData.get("featured") === "on",
  };
}

export async function createBrand(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  try {
    await api.createBrand(bodyFromForm(formData));
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Failed to create brand." };
  }
  revalidatePath("/brands");
  redirect("/brands");
}

export async function updateBrand(
  id: number,
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  try {
    await api.updateBrand(id, bodyFromForm(formData));
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Failed to update brand." };
  }
  revalidatePath("/brands");
  redirect("/brands");
}

export async function deleteBrand(id: number): Promise<{ error?: string } | void> {
  try {
    await api.deleteBrand(id);
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Failed to delete brand." };
  }
  revalidatePath("/brands");
}

export async function syncBrandsFromProducts(): Promise<void> {
  await api.syncBrands().catch(() => {});
  revalidatePath("/brands");
}
