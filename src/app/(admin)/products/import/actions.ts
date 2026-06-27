"use server";

import { api, ApiError } from "@/lib/api";

export type ImportResult = {
  created: number;
  updated: number;
  errors: { row: number; message: string }[];
};

export async function importProductsAction(rows: Record<string, unknown>[]): Promise<ImportResult | { error: string }> {
  try {
    const result = await api.importProducts(rows);
    return result;
  } catch (e) {
    return { error: e instanceof ApiError ? e.message : "Import failed. Please try again." };
  }
}
