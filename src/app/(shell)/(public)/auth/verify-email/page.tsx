"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircle, XCircle } from "lucide-react";
import { UjuziLoader } from "@/components/ui/UjuziLoader";
import { verifyEmail } from "@/lib/actions/auth";
import { AuthShell, AuthCard } from "@/components/auth/AuthShell";

function VerifyEmailContent() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const router = useRouter();
  const { update } = useSession();

  const [status, setStatus] = useState<"checking" | "success" | "error">(
    token ? "checking" : "error"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const ranRef = useRef(false);
  const updateRef = useRef(update);
  updateRef.current = update;
  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    if (!token || ranRef.current) return;
    ranRef.current = true;

    verifyEmail(token).then(async (result) => {
      if (result.error) {
        setErrorMessage(result.error);
        setStatus("error");
        return;
      }
      await updateRef.current();
      setStatus("success");
      setTimeout(() => routerRef.current.push("/dashboard"), 3000);
    });
  }, [token]);

  if (status === "checking") {
    return (
      <AuthShell
        panelTitle="Verifying your email"
        panelSubtitle="Just a moment while we confirm your email address."
      >
        <AuthCard>
          <div className="flex flex-col items-center py-6 text-center">
            <UjuziLoader size="md" label="Verifying" />
          </div>
        </AuthCard>
      </AuthShell>
    );
  }

  if (status === "error") {
    return (
      <AuthShell
        panelTitle="Verification link issue"
        panelSubtitle="This link may have expired or already been used."
      >
        <AuthCard>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="font-display text-xl font-bold text-gray-900">
              {token ? "Verification failed" : "Invalid verification link"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {errorMessage || "This verification link is invalid or has expired."}
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
      panelTitle="You're all set"
      panelSubtitle="Your email address has been verified."
    >
      <AuthCard>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="font-display text-xl font-bold text-gray-900">Email verified!</h2>
          <p className="mt-2 text-sm text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </AuthCard>
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
