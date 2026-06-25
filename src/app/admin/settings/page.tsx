import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PLATFORM } from "@/lib/constants";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Platform settings</h1>
      <p className="text-sm text-gray-500 mb-6">
        Core platform configuration. Advanced settings (revenue split, feature flags, email
        templates) are managed via environment variables for now.
      </p>

      <Card className="p-4 space-y-4 mb-4">
        <h2 className="font-semibold text-sm">General</h2>
        <dl className="text-sm space-y-2">
          <div className="flex justify-between">
            <dt className="text-gray-500">Platform name</dt>
            <dd className="font-medium">{PLATFORM.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Public URL</dt>
            <dd className="font-mono text-xs">{process.env.NEXTAUTH_URL ?? "http://localhost:3000"}</dd>
          </div>
        </dl>
      </Card>

      <Card className="p-4 space-y-3 mb-4">
        <h2 className="font-semibold text-sm">Integrations</h2>
        <ul className="text-sm space-y-2">
          <li className="flex justify-between">
            <span className="text-gray-500">Email (Gmail SMTP)</span>
            <span>{process.env.GMAIL_USER ? "Configured" : "Not configured"}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-500">Web push (VAPID)</span>
            <span>{process.env.VAPID_PRIVATE_KEY ? "Configured" : "Not configured"}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-500">Firebase FCM</span>
            <span>{process.env.FIREBASE_PROJECT_ID ? "Configured" : "Not configured"}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-500">Payments</span>
            <span>Sandbox mode (no live PSP)</span>
          </li>
        </ul>
      </Card>

      <Card className="p-4">
        <h2 className="font-semibold text-sm mb-2">Moderation</h2>
        <p className="text-sm text-gray-500 mb-3">
          Course review and discussion moderation are handled in dedicated admin sections.
        </p>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/courses">Course queue</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/discussions">Discussions</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
