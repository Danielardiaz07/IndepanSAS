"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import {
  CART_STORAGE_KEY,
  addItem,
  cartTotal,
  parseStoredCart,
  removeItem,
  resolveCart,
  setQty as setItemQty,
  type CartItem,
  type CartLine,
} from "@/lib/cart";
import { useCompactCatalog } from "@/lib/compact-catalog";
import { trackEvent } from "@/lib/analytics";
import type { CompactProduct } from "@/types/catalog";

/* ---------- Almacén del carrito: localStorage como fuente de verdad ---------- */

const listeners = new Set<() => void>();
/** Respaldo en memoria cuando el navegador bloquea localStorage. */
let memoryRaw = "";

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => e.key === CART_STORAGE_KEY && cb();
  window.addEventListener("storage", onStorage); // cambios desde otras pestañas
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function readRaw(): string {
  try {
    return window.localStorage.getItem(CART_STORAGE_KEY) ?? "";
  } catch {
    return memoryRaw;
  }
}

function writeItems(items: CartItem[]): void {
  const raw = items.length ? JSON.stringify(items) : "";
  memoryRaw = raw;
  try {
    if (raw) window.localStorage.setItem(CART_STORAGE_KEY, raw);
    else window.localStorage.removeItem(CART_STORAGE_KEY);
  } catch {
    /* el carrito sigue funcionando en memoria */
  }
  listeners.forEach((l) => l());
}

const readItems = (): CartItem[] => parseStoredCart(readRaw() || null);

/* ---------- Contexto ---------- */

interface CartContextValue {
  /** Ítems guardados. Vacío hasta que el cliente hidrata. */
  items: CartItem[];
  /** Ítems resueltos contra el catálogo vigente; null mientras carga. */
  lines: CartLine[] | null;
  total: number;
  count: number;
  /** Se incrementa cada vez que se agrega algo; sirve para animar el contador. */
  addedTick: number;
  ready: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (product: CompactProduct, qty: number) => void;
  setQty: (product: CompactProduct, qty: number) => void;
  remove: (code: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}

const noopSubscribe = () => () => {};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "");
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [isOpen, setIsOpen] = useState(false);
  const [addedTick, setAddedTick] = useState(0);

  const items = useMemo(() => parseStoredCart(raw || null), [raw]);

  const catalog = useCompactCatalog(items.length > 0 || isOpen);
  const catalogMap = useMemo(() => (catalog ? new Map(catalog.map((p) => [p.c, p])) : null), [catalog]);

  const lines = useMemo(() => (catalogMap ? resolveCart(items, catalogMap) : null), [items, catalogMap]);
  const total = useMemo(() => (lines ? cartTotal(lines) : 0), [lines]);

  const add = useCallback((product: CompactProduct, qty: number) => {
    writeItems(addItem(readItems(), product, qty));
    setAddedTick((t) => t + 1);
    trackEvent("add_to_cart", { item_id: product.c, item_name: product.n, quantity: qty });
  }, []);

  const setQty = useCallback((product: CompactProduct, qty: number) => {
    writeItems(setItemQty(readItems(), product, qty));
  }, []);

  const remove = useCallback((code: string) => writeItems(removeItem(readItems(), code)), []);
  const clear = useCallback(() => writeItems([]), []);
  const open = useCallback(() => {
    setIsOpen(true);
    trackEvent("begin_checkout");
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      lines,
      total,
      count: lines ? lines.length : items.length,
      addedTick,
      ready,
      isOpen,
      open,
      close,
      add,
      setQty,
      remove,
      clear,
    }),
    [items, lines, total, addedTick, ready, isOpen, open, close, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
