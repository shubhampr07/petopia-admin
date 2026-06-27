import { PetopiaLogo } from "@/components/PetopiaLogo";
import { AdminNavLinks } from "@/components/AdminNavLinks";
import { SignOutButton } from "@/components/SignOutButton";
import { cn } from "@/lib/utils";

interface Props {
  email: string;
  onNavigate?: () => void;
  className?: string;
}

export function SidebarContent({ email, onNavigate, className }: Props) {
  return (
    <div className={cn("flex flex-col h-full min-h-0", className)}>
      <div className="px-4 sm:px-5 py-4 sm:py-5 shrink-0">
        <PetopiaLogo subtitle="Admin Panel" href="/" height={34} />
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto overscroll-contain">
        <AdminNavLinks onNavigate={onNavigate} />
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border shrink-0">
        <div className="px-3 pb-3 text-xs truncate text-muted-foreground">{email}</div>
        <SignOutButton />
      </div>
    </div>
  );
}
