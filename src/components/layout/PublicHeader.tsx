"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Menu, X, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_PUBLIC } from "@/lib/constants";
import { UjuziLogo } from "@/components/brand/UjuziLogo";
import { useCartStore } from "@/store/cartStore";

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const cartCount = useCartStore((s) => s.items.length);
  const isAuthenticated = status === "authenticated" && !!session?.user;
  const isInstructor =
    session?.user?.role === "INSTRUCTOR" || session?.user?.role === "ADMIN";

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q") as string;
    if (q?.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <UjuziLogo variant="full" theme="light" logoHeight={56} href="/" />

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              name="q"
              type="search"
              placeholder="Search courses..."
              className="h-10 w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </form>

        <nav className="hidden items-center gap-5 lg:flex">
          {NAV_PUBLIC.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/cart" className="relative rounded-lg p-2 hover:bg-gray-100">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              {isInstructor && (
                <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
                  <Link href="/instructor/dashboard">Teach</Link>
                </Button>
              )}
              <Button asChild variant="primary" size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild variant="primary" size="sm">
                <Link href="/auth/register">Sign up</Link>
              </Button>
            </>
          )}
          <button
            type="button"
            className="rounded-lg p-2 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-gray-100 bg-white px-4 py-4 lg:hidden">
          <form onSubmit={handleSearch} className="mb-4 md:hidden">
            <input
              name="q"
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </form>
          {NAV_PUBLIC.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 text-sm font-medium text-gray-700"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
