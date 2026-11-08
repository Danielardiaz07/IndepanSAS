"use client";

import { track } from "@vercel/analytics";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Evento a Google Analytics (si está configurado) y a Vercel Analytics. */
export function trackEvent(name: string, params: Params = {}): void {
  try {
    window.gtag?.("event", name, params);
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined)) as Record<
      string,
      string | number | boolean
    >;
    track(name, clean);
  } catch {
    /* la analítica nunca debe romper la página */
  }
}
