import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { Sidebar } from "@/components/Sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await api.me().catch(() => null);
  if (!me) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar email={me.email} />
      <main className="flex-1 min-w-0 px-8 py-8 max-w-[1280px]">{children}</main>
    </div>
  );
}
