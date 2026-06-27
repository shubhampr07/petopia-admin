import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { AdminShell } from "@/components/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await api.me().catch(() => null);
  if (!me) redirect("/login");

  return <AdminShell email={me.email}>{children}</AdminShell>;
}
