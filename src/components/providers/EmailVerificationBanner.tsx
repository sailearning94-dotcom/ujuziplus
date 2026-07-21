"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { MailWarning, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendVerificationEmail } from "@/lib/actions/auth";
import { useAppStore } from "@/store/appStore";

export function EmailVerificationBanner() {
  const { data: session } = useSession();
  const [dismissed, setDismissed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const showToast = useAppStore((s) => s.showToast);

  if (!session?.user || session.user.emailVerified !== false || dismissed) return null;

  const resend = () => {
    startTransition(async () => {
      const result = await sendVerificationEmail(session.user.id);
      if (result.error) {
        showToast(result.error, "error");
      } else {
        showToast("Verification email sent — check your inbox.", "success");
      }
    });
  };

  return (
    <div
      role="status"
      className="email-verify-banner flex items-center gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900"
    >
      <MailWarning className="h-4 w-4 shrink-0" />
      <p className="flex-1">Please verify your email address to secure your account.</p>
      <Button size="sm" variant="outline" disabled={isPending} onClick={resend}>
        {isPending ? "Sending…" : "Resend email"}
      </Button>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setDismissed(true)}
        className="text-amber-700 hover:text-amber-900"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
