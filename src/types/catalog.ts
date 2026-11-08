/** Unidad en la que el cliente elige la cantidad. */
export type SaleUnit = "un" | "kg" | "g";

export interface Product {
  /** Código del sistema de inventario (único y estable). */
  code: string;
  /** Slug único para la URL (nombre + código). */
  slug: string;
  /** Nombre limpio para mostrar. */
  name: string;
  /** Nombre original del Excel (trazabilidad). */
  originalName: string;
  department: string;
  subcategory: string;
  brand: string | null;
  /** Precio en COP por `unit`. `null` = consultar precio. */
  price: number | null;
  /** Unidad en la que se elige la cantidad. */
  unit: SaleUnit;
  /** Presentación detectada en el nombre, p. ej. "500 g" o "50 kg". */
  size: string | null;
  minQty: number;
  step: number;
  available: boolean;
  /** Ruta pública de la imagen, o null para usar el placeholder del departamento. */
  image: string | null;
  description: string | null;
  featured: boolean;
}

/** Versión liviana para búsqueda y carrito en el cliente. */
export interface CompactProduct {
  c: string; // code
  s: string; // slug
  n: string; // name
  d: string; // department slug
  sc: string; // subcategory
  b: string | null; // brand
  p: number | null; // price
  u: SaleUnit;
  z: string | null; // size
  mn: number;
  st: number;
  a: boolean; // available
  i: string | null; // image
}

export interface Department {
  slug: string;
  name: string;
  /** Texto corto para tarjetas y metadescripción. */
  description: string;
  count: number;
  subcategories: { name: string; slug: string; count: number }[];
}

/** Corrección manual por código de producto (ver src/data/overrides.ts). */
export interface ProductOverride {
  name?: string;
  description?: string;
  image?: string;
  department?: string;
  subcategory?: string;
  brand?: string;
  hidden?: boolean;
  featured?: boolean;
  unit?: SaleUnit;
  minQty?: number;
  step?: number;
  price?: number | null;
}
