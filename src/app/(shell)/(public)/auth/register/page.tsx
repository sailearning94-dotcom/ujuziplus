"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { CheckCircle, Plus, Trash2 } from "lucide-react";
import { UjuziLoader } from "@/components/ui/UjuziLoader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/form-alert";
import { registerUser } from "@/lib/actions/auth";
import {
  AuthShell,
  AuthCard,
  AuthLogo,
  authInputClass,
  authButtonClass,
} from "@/components/auth/AuthShell";

type CredentialDraft = {
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
};

const emptyCredential = (): CredentialDraft => ({
  title: "",
  issuer: "",
  issueDate: "",
  credentialUrl: "",
});

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<"STUDENT" | "INSTRUCTOR">("STUDENT");
  const [credentials, setCredentials] = useState<CredentialDraft[]>([emptyCredential()]);
  const [pendingApproval, setPendingApproval] = useState(false);

  function updateCredential(index: number, field: keyof CredentialDraft, value: string) {
    setCredentials((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  }

  function addCredential() {
    setCredentials((prev) => [...prev, emptyCredential()]);
  }

  function removeCredential(index: number) {
    setCredentials((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    if (role === "INSTRUCTOR") {
      const cleaned = credentials
        .map((c) => ({
          title: c.title.trim(),
          issuer: c.issuer.trim() || undefined,
          issueDate: c.issueDate || undefined,
          credentialUrl: c.credentialUrl.trim() || undefined,
        }))
        .filter((c) => c.title.length > 0);

      formData.set("credentials", JSON.stringify(cleaned));
    }

    const result = await registerUser(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result.pendingInstructorApproval) {
      setLoading(false);
      setPendingApproval(true);
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

  if (pendingApproval) {
    return (
      <AuthShell
        panelTitle="Thanks for applying to teach"
        panelSubtitle="Our team reviews every instructor application to keep the learning experience high quality."
      >
        <AuthCard>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Your instructor application is under review
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              An admin will review your certifications and get back to you by email. You&apos;ll
              be able to sign in as soon as your application is approved.
            </p>
            <Link
              href="/auth/login"
              className="mt-6 inline-block text-sm font-semibold text-brand hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </AuthCard>
      </AuthShell>
    );
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
          {error && <FormAlert variant="error">{error}</FormAlert>}

          <Input
            label="Full name"
            name="fullName"
            type="text"
            placeholder="William Mwangi"
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Min. 8 characters"
            required
            minLength={8}
            autoComplete="new-password"
          />

          <div className="space-y-1.5">
            <Label htmlFor="register-role">I want to</Label>
            <select
              id="register-role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value as "STUDENT" | "INSTRUCTOR")}
              className={`${authInputClass} bg-white`}
            >
              <option value="STUDENT">Learn — I&apos;m a student</option>
              <option value="INSTRUCTOR">Teach — I&apos;m an instructor</option>
            </select>
          </div>

          {role === "INSTRUCTOR" && (
            <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Certifications</p>
                <p className="text-xs text-gray-500">
                  Add certifications or credentials so admins can verify your expertise. At least
                  one is required.
                </p>
              </div>

              {credentials.map((cred, index) => (
                <div key={index} className="space-y-2 rounded-lg border border-gray-200 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`cred-title-${index}`}>Certification {index + 1}</Label>
                    {credentials.length > 1 && (
                      <button
                        type="button"
                        aria-label={`Remove certification ${index + 1}`}
                        onClick={() => removeCredential(index)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <Input
                    id={`cred-title-${index}`}
                    placeholder="e.g. Certified Robotics Instructor"
                    value={cred.title}
                    onChange={(e) => updateCredential(index, "title", e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Issuer (optional)"
                      value={cred.issuer}
                      onChange={(e) => updateCredential(index, "issuer", e.target.value)}
                    />
                    <Input
                      type="date"
                      value={cred.issueDate}
                      onChange={(e) => updateCredential(index, "issueDate", e.target.value)}
                    />
                  </div>
                  <Input
                    placeholder="Credential URL (optional)"
                    value={cred.credentialUrl}
                    onChange={(e) => updateCredential(index, "credentialUrl", e.target.value)}
                  />
                </div>
              ))}

              <Button type="button" variant="outline" size="sm" onClick={addCredential}>
                <Plus className="mr-1 h-3.5 w-3.5" /> Add another certification
              </Button>
            </div>
          )}

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
