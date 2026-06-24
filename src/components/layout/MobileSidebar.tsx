"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { UjuziLogo } from "@/components/brand/UjuziLogo";
import { NAV_STUDENT, NAV_WAZILAB } from "@/lib/constants";
import { UJUZI } from "@/lib/ujuzi-brand";
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
  Heart,
  Lightbulb,
  Home,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FlaskConical,
  Trophy,
  Users,
  FolderOpen,
  Building2,
  Award,
  Heart,
  Lightbulb,
  Home,
};

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={onClose} />
      <aside
        className="fixed left-0 top-0 z-50 flex h-full w-[250px] flex-col text-white lg:hidden"
        style={{ backgroundColor: UJUZI.sidebar }}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/20 px-4">
          <UjuziLogo variant="full" theme="on-dark" logoHeight={48} href="/" />
          <button type="button" onClick={onClose} aria-label="Close menu">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 ujuzi-scroll-dark">
          {NAV_WAZILAB.map((item) => {
            const Icon = iconMap[item.icon] || Home;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-white/10"
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
          <div className="my-2 border-t border-white/20" />
          {NAV_STUDENT.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-white/10"
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
