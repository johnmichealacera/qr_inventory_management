"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ScanLine,
  ArrowLeftRight,
  FileBarChart,
  Shield,
  Users,
  LogOut,
  Menu,
  X,
  QrCode,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Categories", href: "/categories", icon: FolderOpen },
  { name: "QR Scanner", href: "/scan", icon: ScanLine },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Reports", href: "/reports", icon: FileBarChart },
  { name: "Audit Logs", href: "/audit-logs", icon: Shield, roles: ["Admin", "Auditor"] },
  { name: "Users", href: "/users", icon: Users, roles: ["Admin"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const userRole = session?.user?.role;

  const filteredNav = navigation.filter(
    (item) => !item.roles || (userRole && item.roles.includes(userRole))
  );

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 rounded-md bg-background p-2 shadow-md lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <QrCode className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">QR Inventory</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {filteredNav.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <Separator />
        <div className="p-4">
          {session?.user && (
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-xs font-semibold">
                  {session.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{session.user.name}</p>
                <Badge variant="secondary" className="mt-0.5 text-xs">
                  {session.user.role}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
