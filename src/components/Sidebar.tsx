import { SidebarContent } from "@/components/SidebarContent";

/** @deprecated Use AdminShell — kept for direct import if needed */
export function Sidebar({ email }: { email: string }) {
  return (
    <aside className="hidden md:flex flex-col shrink-0 w-[248px] bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
      <SidebarContent email={email} />
    </aside>
  );
}
