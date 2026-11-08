/**
 * Convierte data/source/listado.xlsx en datos tipados para la web.
 * Uso: pnpm catalog:build
 * Genera src/data/generated/* (no editar a mano) y un reporte en Markdown.
 */
import ExcelJS from "exceljs";
import fs from "node:fs";
import path from "node:path";
import {
  CATEGORY_TO_DEPARTMENT,
  DEPARTMENTS,
  FORCED_RULES,
  FALLBACK_DEPARTMENT,
  KEYWORD_RULES,
  SUBCATEGORY_NAMES,
} from "./catalog/config";
import {
  cleanBrand,
  cleanName,
  cleanSubcategory,
  departmentByKeywords,
  inferSale,
  parseSize,
  slugify,
} from "./catalog/normalize";
import { overrides } from "../src/data/overrides";
import type { CompactProduct, Department, Product } from "../src/types/catalog";

const ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(ROOT, "data", "source", "listado.xlsx");
const OUT_DIR = path.join(ROOT, "src", "data", "generated");
const PUBLIC_PRODUCTS = path.join(ROOT, "public", "products");

function cellText(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    if ("richText" in value) return value.richText.map((r) => r.text).join("");
    if ("result" in value) return String(value.result ?? "");
    if ("text" in value) return String(value.text);
    return "";
  }
  return String(value).trim();
}

function cellNumber(value: ExcelJS.CellValue): number {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && "result" in value && typeof value.result === "number") return value.result;
  const n = parseFloat(cellText(value).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

interface RawRow {
  category: string | null;
  brand: string | null;
  code: string;
  name: string;
  price: number;
  stock: number;
}

async function readRows(): Promise<RawRow[]> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(SOURCE);
  const ws = wb.worksheets[0];
  const rows: RawRow[] = [];
  let category: string | null = null;
  let brand: string | null = null;
  // Fila 1: título, fila 2: encabezados.
  for (let r = 3; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const cat = cellText(row.getCell(2).value);
    const br = cellText(row.getCell(4).value);
    if (cat) {
      category = cat;
      brand = null; // la marca se reinicia al cambiar de categoría
    }
    if (br) brand = br;
    const code = cellText(row.getCell(5).value);
    if (!code) continue;
    rows.push({
      category,
      brand,
      code,
      name: cellText(row.getCell(6).value),
      price: cellNumber(row.getCell(7).value),
      stock: cellNumber(row.getCell(8).value),
    });
  }
  return rows;
}

function resolveDepartment(raw: RawRow): { slug: string; via: "category" | "keywords" } {
  const upperName = raw.name.toUpperCase();
  const forced = FORCED_RULES.find((r) => r.test.test(upperName));
  if (forced) return { slug: forced.department, via: "keywords" };
  const key = raw.category?.trim().toUpperCase() ?? "";
  const needsKeywords = !key || key === "VARIOS 900";
  if (!needsKeywords) {
    const mapped = CATEGORY_TO_DEPARTMENT[key];
    if (mapped) return { slug: mapped, via: "category" };
  }
  return {
    slug: departmentByKeywords(raw.name.toUpperCase(), KEYWORD_RULES, FALLBACK_DEPARTMENT),
    via: "keywords",
  };
}

async function main() {
  if (!fs.existsSync(SOURCE)) throw new Error(`No existe ${SOURCE}`);
  const raws = await readRows();
  const deptSlugs = new Set(DEPARTMENTS.map((d) => d.slug));
  const unmapped = new Set<string>();
  const warnings: string[] = [];

  const hasImage = (code: string) => fs.existsSync(path.join(PUBLIC_PRODUCTS, `${code}.webp`));

  const products: Product[] = [];
  const stats = { byKeywords: 0, weightKg: [] as string[], granel: [] as string[], priceOnRequest: [] as string[] };
  const usedSlugs = new Set<string>();

  for (const raw of raws) {
    const ov = overrides[raw.code] ?? {};
    if (ov.hidden) continue;

    const key = raw.category?.trim().toUpperCase() ?? "";
    if (key && key !== "VARIOS 900" && !CATEGORY_TO_DEPARTMENT[key]) unmapped.add(key);

    const resolved = resolveDepartment(raw);
    if (resolved.via === "keywords") stats.byKeywords++;
    const department = ov.department ?? resolved.slug;
    if (!deptSlugs.has(department)) throw new Error(`Departamento inválido "${department}" en ${raw.code}`);

    const name = ov.name ?? cleanName(raw.name);
    const sale = inferSale(name, raw.stock);
    const size = parseSize(name)?.text ?? null;
    const unit = ov.unit ?? sale.unit;
    if (sale.reason === "weight-kg") stats.weightKg.push(`${raw.code} ${name}`);
    if (sale.reason === "granel") stats.granel.push(`${raw.code} ${name} ($${raw.price}/g)`);

    const priceFromSource = raw.price > 0 ? raw.price : null;
    const price = ov.price !== undefined ? ov.price : priceFromSource;
    if (price === null) stats.priceOnRequest.push(`${raw.code} ${name}`);

    let slug = `${slugify(name)}-${raw.code}`;
    if (usedSlugs.has(slug)) {
      warnings.push(`Slug repetido: ${slug}`);
      slug = `${slug}-${usedSlugs.size}`;
    }
    usedSlugs.add(slug);

    products.push({
      code: raw.code,
      slug,
      name,
      originalName: raw.name,
      department,
      subcategory: ov.subcategory ?? cleanSubcategory(raw.category, SUBCATEGORY_NAMES),
      brand: ov.brand ?? cleanBrand(raw.brand),
      price,
      unit,
      size,
      minQty: ov.minQty ?? (ov.unit ? 1 : sale.minQty),
      step: ov.step ?? (ov.unit ? 1 : sale.step),
      available: raw.stock > 0,
      image: ov.image ?? (hasImage(raw.code) ? `/products/${raw.code}.webp` : null),
      description: ov.description ?? null,
      featured: ov.featured ?? false,
    });
  }

  const deptOrder = new Map(DEPARTMENTS.map((d, i) => [d.slug, i]));
  products.sort(
    (a, b) =>
      (deptOrder.get(a.department)! - deptOrder.get(b.department)!) ||
      a.subcategory.localeCompare(b.subcategory, "es") ||
      a.name.localeCompare(b.name, "es"),
  );

  // Validaciones duras
  const codes = new Set<string>();
  for (const p of products) {
    if (codes.has(p.code)) throw new Error(`Código duplicado: ${p.code}`);
    codes.add(p.code);
    if (!p.name) throw new Error(`Nombre vacío: ${p.code}`);
    if (p.price !== null && p.price <= 0) throw new Error(`Precio inválido: ${p.code}`);
    if (p.step <= 0 || p.minQty <= 0) throw new Error(`Paso/mínimo inválido: ${p.code}`);
  }

  // Departamentos con conteos
  const departments: Department[] = DEPARTMENTS.map((d) => {
    const list = products.filter((p) => p.department === d.slug);
    const subs = new Map<string, number>();
    for (const p of list) subs.set(p.subcategory, (subs.get(p.subcategory) ?? 0) + 1);
    return {
      ...d,
      count: list.length,
      subcategories: [...subs.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))
        .map(([name, count]) => ({ name, slug: slugify(name), count })),
    };
  }).filter((d) => d.count > 0);

  const compact: CompactProduct[] = products.map((p) => ({
    c: p.code,
    s: p.slug,
    n: p.name,
    d: p.department,
    sc: p.subcategory,
    b: p.brand,
    p: p.price,
    u: p.unit,
    z: p.size,
    mn: p.minQty,
    st: p.step,
    a: p.available,
    i: p.image,
  }));

  // Diff contra la versión anterior
  const prevPath = path.join(OUT_DIR, "products.json");
  let diffSection = "Sin versión anterior para comparar.\n";
  if (fs.existsSync(prevPath)) {
    const prev: Product[] = JSON.parse(fs.readFileSync(prevPath, "utf8"));
    const prevMap = new Map(prev.map((p) => [p.code, p]));
    const nextMap = new Map(products.map((p) => [p.code, p]));
    const added = products.filter((p) => !prevMap.has(p.code));
    const removed = prev.filter((p) => !nextMap.has(p.code));
    const changed = products.filter((p) => prevMap.has(p.code) && prevMap.get(p.code)!.price !== p.price);
    diffSection =
      `- Nuevos: ${added.length}\n- Retirados: ${removed.length}\n- Cambios de precio: ${changed.length}\n` +
      changed
        .slice(0, 100)
        .map((p) => `  - ${p.code} ${p.name}: ${prevMap.get(p.code)!.price ?? "consultar"} → ${p.price ?? "consultar"}`)
        .join("\n") +
      "\n";
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const write = (file: string, data: unknown) =>
    fs.writeFileSync(path.join(OUT_DIR, file), JSON.stringify(data) + "\n", "utf8");
  write("products.json", products);
  write("catalog-compact.json", compact);
  write("departments.json", departments);

  const withImage = products.filter((p) => p.image).length;
  const report = [
    "# Reporte de catálogo",
    "",
    `Generado: ${new Date().toISOString()}`,
    `Fuente: data/source/listado.xlsx (${raws.length} filas con código)`,
    "",
    "## Resumen",
    `- Productos publicados: ${products.length}`,
    `- Departamentos: ${departments.length}`,
    `- Reasignados por palabras clave (Varios 900 / sin categoría): ${stats.byKeywords}`,
    `- Con imagen real: ${withImage} (${((withImage / products.length) * 100).toFixed(1)} %)`,
    `- "Consultar precio" (precio 0): ${stats.priceOnRequest.length}`,
    `- Vendidos por peso (kg) inferidos: ${stats.weightKg.length}`,
    `- A granel (por gramo): ${stats.granel.length}`,
    "",
    "## Productos por departamento",
    ...departments.map((d) => `- ${d.name}: ${d.count}`),
    "",
    "## Cambios vs versión anterior",
    diffSection,
    "## Categorías del Excel sin mapear",
    unmapped.size ? [...unmapped].map((c) => `- ${c}`).join("\n") : "Ninguna.",
    "",
    "## Advertencias",
    warnings.length ? warnings.map((w) => `- ${w}`).join("\n") : "Ninguna.",
    "",
    "## Consultar precio",
    stats.priceOnRequest.map((p) => `- ${p}`).join("\n") || "Ninguno.",
    "",
    "## Vendidos por peso (revisar)",
    stats.weightKg.map((p) => `- ${p}`).join("\n") || "Ninguno.",
    "",
    "## A granel",
    stats.granel.map((p) => `- ${p}`).join("\n") || "Ninguno.",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(OUT_DIR, "report.md"), report, "utf8");

  console.log(`OK: ${products.length} productos, ${departments.length} departamentos.`);
  console.log(`Reporte: ${path.relative(ROOT, path.join(OUT_DIR, "report.md"))}`);
  if (unmapped.size) console.warn("Categorías sin mapear:", [...unmapped].join(", "));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
