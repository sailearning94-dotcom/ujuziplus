"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FlaskConical,
  Trophy,
  Users,
  FolderOpen,
  Building2,
  Award,
  User,
  Heart,
  Lightbulb,
  Home,
  FolderKanban,
  Package,
  type LucideIcon,
} from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { UjuziLogo } from "@/components/brand/UjuziLogo";
import { NAV_STUDENT, NAV_WAZILAB } from "@/lib/constants";
import { UJUZI } from "@/lib/ujuzi-brand";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FlaskConical,
  Trophy,
  Users,
  FolderOpen,
  FolderKanban,
  Building2,
  Award,
  User,
  Heart,
  Lightbulb,
  Home,
  Package,
};

export function AppSidebar() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isInstructor = role === "INSTRUCTOR" || role === "ADMIN";

  return (
    <aside
      className="hidden w-[250px] flex-shrink-0 lg:flex lg:flex-col text-white"
      style={{
        backgroundColor: UJUZI.sidebar,
        borderRight: `1px solid ${UJUZI.sidebarBorder}`,
      }}
    >
      <div className="flex h-16 items-center border-b border-white/20 px-4">
        <UjuziLogo variant="full" theme="on-dark" logoHeight={60} href="/" />
      </div>

      <nav className="border-b border-white/10 p-2">
        <p className="px-3 py-1 text-[10px] font-semibold uppercase text-white/50">Platform</p>
        {NAV_WAZILAB.map((item) => {
          const Icon = iconMap[item.icon] || Home;
          return (
            <NavLink
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/85 hover:bg-white/10"
              activeClassName="bg-white/15 text-white"
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        <p className="px-3 py-1 text-[10px] font-semibold uppercase text-white/50">My learning</p>
        {NAV_STUDENT.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          return (
            <NavLink
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/85 hover:bg-white/10"
              activeClassName="bg-white/15 text-white"
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {isInstructor && (
        <div className="space-y-1 border-t border-white/20 p-3">
          <NavLink
            href="/instructor/dashboard"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
            activeClassName="bg-white/15"
          >
            Switch to Instructor
          </NavLink>
        </div>
      )}
    </aside>
  );
}
