"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const acceptAll = () => {
    window.localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    window.localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-label="Cookie consent">
      <div className="cookie-consent__icon">
        <Cookie className="h-5 w-5" />
      </div>
      <div className="cookie-consent__body">
        <p className="cookie-consent__text">
          We use cookies to keep you signed in and improve your experience. Essential cookies are
          always on; you can decline the rest. See our{" "}
          <Link href="/privacy" className="cookie-consent__link">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
      <div className="cookie-consent__actions">
        <Button size="sm" variant="outline" onClick={decline}>
          Decline
        </Button>
        <Button size="sm" onClick={acceptAll}>
          Accept all cookies
        </Button>
      </div>
    </div>
  );
}
