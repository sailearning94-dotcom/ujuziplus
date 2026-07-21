"use client";

import { usePathname } from "next/navigation";
import { ParticleNetworkBackground } from "@/components/home/ParticleNetworkBackground";

export interface ParticleLayoutGateProps {
  colors: string;
  rainbowMode: boolean;
  speed: number;
  connectDistance: number;
  lineThickness: number;
  interaction: string;
  intensity: number;
  /** "belowFeatured" only makes sense on the homepage, which renders it itself. */
  scope: string;
}

/**
 * Mounts the particle background on every page under this layout. On the
 * homepage specifically, skip when scope is "belowFeatured" — that
 * placement is tied to the homepage's own Featured-courses section, which
 * has no equivalent elsewhere, so the homepage renders that case itself.
 */
export function ParticleLayoutGate({ scope, ...rest }: ParticleLayoutGateProps) {
  const pathname = usePathname();
  if (pathname === "/" && scope === "belowFeatured") return null;

  return <ParticleNetworkBackground enabled {...rest} />;
}
