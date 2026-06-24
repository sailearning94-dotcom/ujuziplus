"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { UjuziLoader } from "@/components/ui/UjuziLoader";
import { registerUser } from "@/lib/actions/auth";
import {
  AuthShell,
  AuthCard,
  AuthLogo,
  authInputClass,
  authButtonClass,
  authErrorClass,
} from "@/components/auth/AuthShell";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    router.push("/onboarding");
    router.refresh();
  }

  return (
    <AuthShell
      panelTitle="Join thousands of innovators"
      panelSubtitle="Create your free account and start learning with hands-on courses, kits, and lab projects."
    >
      <AuthCard>
        <AuthLogo
          title="Create account"
          subtitle={
            <>
              Already have an account?{" "}
              <Link href="/auth/login" className="font-semibold text-brand hover:underline">
                Sign in
              </Link>
            </>
          }
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className={authErrorClass}>{error}</div>}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Full name</label>
            <input
              name="fullName"
              type="text"
              placeholder="William Mwangi"
              required
              className={authInputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              className={authInputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Min. 8 characters"
              required
              minLength={8}
              autoComplete="new-password"
              className={authInputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">I want to</label>
            <select
              name="role"
              className={`${authInputClass} bg-white`}
            >
              <option value="STUDENT">Learn — I&apos;m a student</option>
              <option value="INSTRUCTOR">Teach — I&apos;m an instructor</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className={authButtonClass}>
            {loading ? <UjuziLoader size="sm" className="ujuzi-loader--on-brand" label="Creating account" /> : "Create account"}
          </button>

          <p className="text-center text-xs text-gray-500">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="text-brand hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-brand hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
