import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = (process.env.ADMIN_API_URL || "http://localhost:4000").replace(/\/$/, "");

function esc(v: unknown): string {
  const s = v == null ? "" : String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCSV(headers: string[], rows: string[][]): string {
  return [headers.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");
}

export async function GET(req: NextRequest) {
  const store = await cookies();
  const token = store.get("petopia_admin_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const qs = new URLSearchParams();
  if (searchParams.get("status"))   qs.set("status",   searchParams.get("status")!);
  if (searchParams.get("search"))   qs.set("search",   searchParams.get("search")!);
  if (searchParams.get("dateFrom")) qs.set("dateFrom", searchParams.get("dateFrom")!);
  if (searchParams.get("dateTo"))   qs.set("dateTo",   searchParams.get("dateTo")!);

  const url = `${API_BASE}/api/admin/orders${qs.toString() ? `?${qs}` : ""}`;
  const apiRes = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!apiRes.ok) return NextResponse.json({ error: "Failed to fetch orders" }, { status: apiRes.status });

  const { orders } = await apiRes.json() as { orders: Record<string, unknown>[] };

  const headers = ["Order ID", "Status", "Customer Name", "Customer Email", "Items", "Total", "Currency", "Date"];
  const rows = orders.map((o) => {
    const cust = o.customer as Record<string, unknown> | null;
    return [
      String(o.id),
      String(o.status),
      cust?.name ? String(cust.name) : "",
      cust?.email ? String(cust.email) : "",
      String(o.itemCount),
      String(o.total),
      String(o.currency),
      new Date(String(o.createdAt)).toLocaleDateString("en-GB"),
    ];
  });

  const csv = toCSV(headers, rows);
  const filename = `orders-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
