"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  window.addEventListener("popstate", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("popstate", cb);
  };
}

const getSnapshot = () => window.location.search;
const getServerSnapshot = () => "";

/** El parámetro ?q= de la URL como fuente de verdad de la búsqueda (compartible y sin efectos). */
export function useUrlQuery(): [string, (q: string) => void] {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = new URLSearchParams(search).get("q") ?? "";

  const set = useCallback((q: string) => {
    const url = new URL(window.location.href);
    if (q) url.searchParams.set("q", q);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
    listeners.forEach((l) => l());
  }, []);

  return [value, set];
}
