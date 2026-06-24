"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Package, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard/my-courses", icon: BookOpen, label: "Learn" },
  { href: "/kits", icon: Package, label: "Kits" },
  { href: "/dashboard/community", icon: Users, label: "Community" },
  { href: "/dashboard/settings/profile", icon: User, label: "Profile" },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200/80 bg-white/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="flex">
        {ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
                active ? "text-brand" : "text-gray-500"
              )}
            >
              {active && (
                <span className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-brand" />
              )}
              <item.icon className={cn("h-5 w-5", active && "scale-110")} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
