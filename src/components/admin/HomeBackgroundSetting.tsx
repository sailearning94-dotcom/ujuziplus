"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MediaUploadField } from "@/components/ui/MediaUploadField";
import { updateHomeSectionBackground } from "@/lib/actions/platform-settings";
import { useAppStore } from "@/store/appStore";

export function HomeBackgroundSetting({ initialUrl }: { initialUrl: string | null }) {
  const router = useRouter();
  const showToast = useAppStore((s) => s.showToast);
  const [isPending, startTransition] = useTransition();
  const [url, setUrl] = useState(initialUrl ?? "");

  const save = () => {
    startTransition(async () => {
      const res = await updateHomeSectionBackground(url.trim() || null);
      if (res.success) {
        showToast("Homepage background updated", "success");
        router.refresh();
      } else {
        showToast(res.error ?? "Failed", "error");
      }
    });
  };

  const clear = () => {
    setUrl("");
    startTransition(async () => {
      const res = await updateHomeSectionBackground(null);
      if (res.success) {
        showToast("Homepage background reset to default", "success");
        router.refresh();
      } else {
        showToast(res.error ?? "Failed", "error");
      }
    });
  };

  return (
    <div className="space-y-3">
      <MediaUploadField
        kind="image"
        label="Background image"
        hint="Shown behind the homepage from the mentor spotlight section down to the bottom. Leave empty for the default background."
        value={url}
        onChange={setUrl}
      />
      <div className="flex gap-2">
        <Button size="sm" disabled={isPending} onClick={save}>
          {isPending ? "Saving…" : "Save"}
        </Button>
        {initialUrl && (
          <Button size="sm" variant="ghost" disabled={isPending} onClick={clear}>
            Reset to default
          </Button>
        )}
      </div>
    </div>
  );
}
