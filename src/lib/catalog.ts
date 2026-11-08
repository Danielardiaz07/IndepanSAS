import "server-only";
import productsJson from "@/data/generated/products.json";
import departmentsJson from "@/data/generated/departments.json";
import type { CompactProduct, Department, Product } from "@/types/catalog";

const products = productsJson as Product[];
const departments = departmentsJson as Department[];

export function getAllProducts(): Product[] {
  return products;
}

export function getDepartments(): Department[] {
  return departments;
}

export function getDepartment(slug: string): Department | undefined {
  return departments.find((d) => d.slug === slug);
}

export function getProductsByDepartment(slug: string): Product[] {
  return products.filter((p) => p.department === slug);
}

export function getProduct(departmentSlug: string, slug: string): Product | undefined {
  return products.find((p) => p.slug === slug && p.department === departmentSlug);
}

export function toCompact(p: Product): CompactProduct {
  return {
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
  };
}

/** Productos de la misma subcategoría (para la página de producto). */
export function relatedProducts(p: Product, limit = 6): Product[] {
  return products
    .filter((x) => x.code !== p.code && x.department === p.department && x.subcategory === p.subcategory)
    .slice(0, limit);
}

/** Muestra variada: hasta `perDepartment` productos con precio de cada departamento. */
export function sampleAcrossDepartments(perDepartment = 2): Product[] {
  const out: Product[] = [];
  for (const d of departments) {
    out.push(...products.filter((p) => p.department === d.slug && p.price !== null).slice(0, perDepartment));
  }
  return out;
}
