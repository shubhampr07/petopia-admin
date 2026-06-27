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

  // ?template=1 → return empty CSV template
  const { searchParams } = new URL(req.url);
  if (searchParams.get("template") === "1") {
    const headers = [
      "id", "name", "brand", "category", "pet", "vibe",
      "price", "oldPrice", "badge", "tag", "img",
      "isBestseller", "isNewArrival", "detailDescription", "detailHighlights",
    ];
    const example = [
      "", "Royal Canin Adult", "Royal Canin", "Food", "Dog", "",
      "140.00", "", "Sale", "", "https://images.unsplash.com/photo-example",
      "false", "false", "Complete nutrition for adult dogs", "Vet-trusted brand|Daily feeding guide",
    ];
    const csv = [headers.join(","), example.map(esc).join(",")].join("\n");
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="products-import-template.csv"`,
      },
    });
  }

  const url = `${API_BASE}/api/admin/products`;
  const apiRes = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!apiRes.ok) return NextResponse.json({ error: "Failed to fetch products" }, { status: apiRes.status });

  const { products } = await apiRes.json() as { products: Record<string, unknown>[] };

  const headers = [
    "id", "name", "brand", "category", "pet", "vibe",
    "price", "oldPrice", "badge", "tag", "img",
    "isBestseller", "isNewArrival", "detailDescription", "detailHighlights",
  ];

  const rows = products.map((p) => {
    const hl = Array.isArray(p.detailHighlights)
      ? (p.detailHighlights as string[]).join("|")
      : "";
    return [
      String(p.id),
      String(p.name ?? ""),
      String(p.brand ?? ""),
      String(p.category ?? ""),
      String(p.pet ?? "All"),
      String(p.vibe ?? ""),
      String(p.price ?? ""),
      String(p.oldPrice ?? ""),
      String(p.badge ?? ""),
      String(p.tag ?? ""),
      String(p.img ?? ""),
      String(p.isBestseller ?? "false"),
      String(p.isNewArrival ?? "false"),
      String(p.detailDescription ?? ""),
      hl,
    ];
  });

  const csv = toCSV(headers, rows);
  const filename = `products-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

/** GET /api/export/products?template=1 — returns empty template CSV */
// handled by the same route; check for ?template param in query
