import type { CompactProduct, SaleUnit } from "@/types/catalog";

export interface CartItem {
  code: string;
  qty: number;
}

export const CART_STORAGE_KEY = "indepan:cart:v1";
export const MAX_QTY = 100000;

/** Redondea a 3 decimales para evitar errores de coma flotante (0.1 + 0.2). */
export function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

/** Ajusta una cantidad al mínimo y al paso del producto. */
export function snapQty(p: Pick<CompactProduct, "mn" | "st">, qty: number): number {
  if (!Number.isFinite(qty)) return p.mn;
  const clamped = Math.min(Math.max(qty, p.mn), MAX_QTY);
  const steps = Math.round((clamped - p.mn) / p.st);
  return round3(p.mn + steps * p.st);
}

/** Total de una línea (COP, entero). El precio es por unidad de venta (g, kg o un). */
export function lineTotal(price: number, qty: number): number {
  return Math.round(price * qty);
}

export function isPurchasable(p: CompactProduct): boolean {
  return p.p !== null && p.p > 0 && p.a;
}

export function addItem(items: CartItem[], p: CompactProduct, qty: number): CartItem[] {
  if (!isPurchasable(p)) return items;
  const existing = items.find((i) => i.code === p.c);
  if (existing) {
    return items.map((i) => (i.code === p.c ? { ...i, qty: snapQty(p, i.qty + qty) } : i));
  }
  return [...items, { code: p.c, qty: snapQty(p, qty) }];
}

export function setQty(items: CartItem[], p: CompactProduct, qty: number): CartItem[] {
  return items.map((i) => (i.code === p.c ? { ...i, qty: snapQty(p, qty) } : i));
}

export function removeItem(items: CartItem[], code: string): CartItem[] {
  return items.filter((i) => i.code !== code);
}

export interface CartLine {
  product: CompactProduct;
  qty: number;
  unit: SaleUnit;
  unitPrice: number;
  total: number;
}

/**
 * Resuelve los ítems contra el catálogo vigente (RF-27): descarta productos que ya no
 * existen o no se pueden comprar, y reajusta cantidades al mínimo/paso actuales.
 */
export function resolveCart(items: CartItem[], catalog: Map<string, CompactProduct>): CartLine[] {
  const lines: CartLine[] = [];
  for (const item of items) {
    const product = catalog.get(item.code);
    if (!product || !isPurchasable(product)) continue;
    const qty = snapQty(product, item.qty);
    lines.push({ product, qty, unit: product.u, unitPrice: product.p!, total: lineTotal(product.p!, qty) });
  }
  return lines;
}

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.total, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.length;
}

/** Lee y valida el carrito guardado; ignora cualquier dato malformado. */
export function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const seen = new Set<string>();
    const items: CartItem[] = [];
    for (const entry of data) {
      if (!entry || typeof entry !== "object") continue;
      const { code, qty } = entry as Record<string, unknown>;
      if (typeof code !== "string" || typeof qty !== "number" || !Number.isFinite(qty) || qty <= 0) continue;
      if (seen.has(code)) continue;
      seen.add(code);
      items.push({ code, qty });
    }
    return items;
  } catch {
    return [];
  }
}
