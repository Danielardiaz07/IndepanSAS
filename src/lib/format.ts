import type { SaleUnit } from "@/types/catalog";

const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const decimal = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 3 });

/** 353700 → "$ 353.700" */
export function formatCOP(value: number): string {
  return cop.format(Math.round(value)).replace(/ /g, " ");
}

/** Precio por unidad de venta: "$ 47 / g", "$ 26.000 / kg", "$ 4.500". */
export function formatUnitPrice(price: number, unit: SaleUnit): string {
  // Los precios por gramo pueden tener decimales (67,35).
  const base = unit === "g" && price % 1 !== 0 ? `$ ${decimal.format(price)}` : formatCOP(price);
  if (unit === "g") return `${base} / g`;
  if (unit === "kg") return `${base} / kg`;
  return base;
}

/** Cantidad legible: 3 → "3", 1.5 kg → "1,5 kg", 1500 g → "1,5 kg". */
export function formatQty(qty: number, unit: SaleUnit): string {
  if (unit === "g") return qty >= 1000 ? `${decimal.format(qty / 1000)} kg` : `${decimal.format(qty)} g`;
  if (unit === "kg") return `${decimal.format(qty)} kg`;
  return decimal.format(qty);
}

/** Etiqueta del selector: "unidades", "kg" o "g". */
export function qtyUnitLabel(unit: SaleUnit): string {
  return unit === "un" ? "" : unit;
}
