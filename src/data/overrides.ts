import type { ProductOverride } from "@/types/catalog";

/**
 * Correcciones manuales por código de producto (columna "Codigo Producto" del Excel).
 * Sobreviven a cada re-importación del catálogo. Ejemplo:
 *
 *   "101002008": { name: "Almendra blanca a granel", featured: true },
 *   "703037008": { image: "/products/703037008.webp", description: "..." },
 *   "999999999": { hidden: true },
 */
export const overrides: Record<string, ProductOverride> = {};
