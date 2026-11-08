import { ACCENT_WORDS, KEEP_UPPER, LOWERCASE_WORDS } from "./config";
import type { SaleUnit } from "../../src/types/catalog";

const UNIT_TOKENS = new Set(["kg", "g", "ml", "l", "lb", "oz", "un", "mts", "cm"]);

/** Quita tildes, pasa a minúsculas y deja solo [a-z0-9-]. */
export function slugify(input: string, maxLength = 70): string {
  const base = input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (base.length <= maxLength) return base;
  const cut = base.slice(0, maxLength);
  const lastDash = cut.lastIndexOf("-");
  return (lastDash > 20 ? cut.slice(0, lastDash) : cut).replace(/-+$/g, "");
}

/** Normaliza unidades escritas de muchas formas ("KILOS", "KLS", "GRS"…). */
function normalizeUnits(upper: string): string {
  return (
    upper
      // "X500" / "X1KG" → "X 500" / "X 1KG"
      .replace(/\bX(?=\d)/g, "X ")
      // "* 135 GR" (asterisco como "x") → "X 135 GR"
      .replace(/\s\*\s*(?=\d)/g, " X ")
      // Unidades de peso/volumen con número delante
      .replace(/(\d)\s*(?:KILOS?|KLS?|KGS?)\b/g, "$1 kg")
      .replace(/(\d)\s*(?:GRAMOS?|GRS?|GMS?)\b/g, "$1 g")
      .replace(/(\d)\s*(?:LITROS?|LTS?|LT)\b/g, "$1 l")
      .replace(/(\d)\s*ML\b/g, "$1 ml")
      .replace(/(\d)\s*(?:LIBRAS?|LBS?)\b/g, "$1 lb")
      .replace(/(\d)\s*OZ\b/g, "$1 oz")
      .replace(/(\d)\s*(?:UNIDADES|UNIDAD|UNDS?|UNS?|UN)\b/g, "$1 un")
      .replace(/(\d)\s*MTS?\b/g, "$1 mts")
      // "X 4 K" → "X 4 kg"
      .replace(/(\d)\s*K\b/g, "$1 kg")
      // Asteriscos decorativos: "X LIBRA******"
      .replace(/\*{2,}/g, "")
      // "X KILO" sin número
      .replace(/\bX\s*(?:KILOS?|KLS?|KGS?|K)\b/g, "X kg")
      .replace(/\bX\s*(?:UNIDADES|UNIDAD|UNDS?|UN)\b/g, "X un")
  );
}

/** Convierte un nombre en MAYÚSCULAS del sistema a un nombre legible. */
export function cleanName(raw: string): string {
  const upper = raw.replace(/\s+/g, " ").trim().toUpperCase();
  const normalized = normalizeUnits(upper);
  let first = true;
  const out = normalized.replace(/[\p{L}\p{N}]+/gu, (token) => {
    const isFirst = first;
    first = false;
    if (UNIT_TOKENS.has(token)) return token; // ya normalizado a minúscula
    if (/\d/.test(token)) return token.toUpperCase();
    if (KEEP_UPPER.has(token)) return token;
    const accented = ACCENT_WORDS[token];
    if (accented) return accented;
    const lower = token.toLowerCase();
    if (!isFirst && LOWERCASE_WORDS.has(lower)) return lower;
    if (token.length <= 3 && !/[AEIOUÁÉÍÓÚ]/.test(token)) return token; // siglas: FM, GMP, K
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  });
  return out.replace(/\s+/g, " ").trim();
}

export function cleanBrand(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.toUpperCase() === "VARIOS") return null;
  const parts = trimmed.split(/\s+-\s+/);
  const chosen = parts[parts.length - 1] || trimmed;
  return cleanName(chosen).replace(/\bS\.a\b\.?/g, "S.A.");
}

export function cleanSubcategory(raw: string | null | undefined, names: Record<string, string>): string {
  if (!raw) return "Otros";
  const key = raw.trim().toUpperCase();
  return names[key] ?? cleanName(key);
}

export interface SizeInfo {
  text: string;
  value: number;
  unit: string;
}

/** Busca la presentación en un nombre ya limpio ("x 500 g", "Caja x 22.7 kg"). */
export function parseSize(cleaned: string): SizeInfo | null {
  const re = /(\d+(?:[.,]\d+)?)\s*(kg|g|ml|l|lb|oz|un|mts)\b/gi;
  const matches = [...cleaned.matchAll(re)];
  if (matches.length === 0) return null;
  const afterX = matches.find((m) => /x\s*$/i.test(cleaned.slice(0, m.index)));
  const m = afterX ?? matches[matches.length - 1];
  return {
    text: `${m[1].replace(",", ".")} ${m[2].toLowerCase()}`,
    value: parseFloat(m[1].replace(",", ".")),
    unit: m[2].toLowerCase(),
  };
}

export interface SaleRule {
  unit: SaleUnit;
  minQty: number;
  step: number;
  /** Razón de la regla, para el reporte. */
  reason: "package" | "granel" | "weight-kg";
}

/**
 * Decide cómo se elige la cantidad.
 * - "A GRANEL": el precio es por gramo (confirmado por el cliente).
 * - Presentación de 1 kg ("x kg", "x 1 kg") con existencias fraccionadas: se vende por peso.
 * - En cualquier otro caso: por unidad/empaque, de 1 en 1.
 */
export function inferSale(cleaned: string, stock: number): SaleRule {
  if (/\bgranel\b/i.test(cleaned)) {
    return { unit: "g", minQty: 100, step: 50, reason: "granel" };
  }
  const isPerKg = /\bx\s*(?:1\s*)?kg\b/i.test(cleaned);
  const fractionalStock = Number.isFinite(stock) && Math.abs(stock - Math.round(stock)) > 1e-9;
  if (isPerKg && fractionalStock) {
    return { unit: "kg", minQty: 0.5, step: 0.5, reason: "weight-kg" };
  }
  return { unit: "un", minQty: 1, step: 1, reason: "package" };
}

/** Departamento por palabras clave (nombre en MAYÚSCULAS). */
export function departmentByKeywords(
  upperName: string,
  rules: { test: RegExp; department: string }[],
  fallback: string,
): string {
  for (const rule of rules) if (rule.test.test(upperName)) return rule.department;
  return fallback;
}
