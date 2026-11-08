"use client";

import { useEffect, useState } from "react";
import type { CompactProduct } from "@/types/catalog";

let cache: CompactProduct[] | null = null;
let pending: Promise<CompactProduct[]> | null = null;

/** Carga el catálogo liviano una sola vez, en un chunk aparte. */
export function loadCompactCatalog(): Promise<CompactProduct[]> {
  if (cache) return Promise.resolve(cache);
  pending ??= import("@/data/generated/catalog-compact.json").then((m) => {
    cache = m.default as CompactProduct[];
    return cache;
  });
  return pending;
}

/** Devuelve el catálogo cuando `enabled` es true; mientras tanto, null. */
export function useCompactCatalog(enabled: boolean): CompactProduct[] | null {
  const [data, setData] = useState<CompactProduct[] | null>(cache);
  useEffect(() => {
    if (!enabled || data) return;
    let alive = true;
    loadCompactCatalog().then((c) => alive && setData(c));
    return () => {
      alive = false;
    };
  }, [enabled, data]);
  return data;
}
