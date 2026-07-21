import dynamic from "next/dynamic";
import { getPlatformSettings } from "@/lib/actions/platform-settings";

const ParticleLayoutGate = dynamic(
  () => import("@/components/home/ParticleLayoutGate").then((m) => ({ default: m.ParticleLayoutGate })),
  { ssr: false }
);

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPlatformSettings().catch(() => null);
  const particlesEnabled = settings?.particlesEnabled ?? false;

  if (!particlesEnabled) return children;

  return (
    <div style={{ position: "relative" }}>
      <ParticleLayoutGate
        scope={settings?.particlesScope ?? "full"}
        colors={settings?.particlesColors ?? "#f39223,#00004D,#1a1a6b,#e0831a"}
        rainbowMode={!!settings?.particlesRainbowMode}
        speed={settings?.particlesSpeed ?? 1}
        connectDistance={settings?.particlesConnectDistance ?? 140}
        lineThickness={settings?.particlesLineThickness ?? 1}
        interaction={settings?.particlesInteraction ?? "repel"}
        intensity={settings?.particlesIntensity ?? 1}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
