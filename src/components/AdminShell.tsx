"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SidebarContent } from "@/components/SidebarContent";
import { PetopiaLogo } from "@/components/PetopiaLogo";

interface Props {
  email: string;
  children: React.ReactNode;
}

export function AdminShell({ email, children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col shrink-0 w-[248px] bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
        <SidebarContent email={email} />
      </aside>

      {/* Mobile drawer */}
      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-[min(280px,88vw)] bg-sidebar border-r border-sidebar-border shadow-xl md:hidden flex flex-col">
            <div className="flex items-center justify-end px-3 pt-3 shrink-0">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent touch-manipulation"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>
            <SidebarContent email={email} onNavigate={() => setMenuOpen(false)} className="-mt-2" />
          </aside>
        </>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-3 py-2.5 bg-primary shadow-sm">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-primary-foreground hover:bg-white/10 touch-manipulation shrink-0"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <PetopiaLogo height={26} tone="onPrimary" href="/" />
        </header>

        <main className="flex-1 min-w-0 w-full px-3 py-4 sm:px-5 sm:py-6 md:px-8 md:py-8 max-w-[1280px]">
          {children}
        </main>
      </div>
    </div>
  );
}
