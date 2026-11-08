/** Configuración editable del pipeline de catálogo. */

export interface DepartmentDef {
  slug: string;
  name: string;
  description: string;
}

export const DEPARTMENTS: DepartmentDef[] = [
  {
    slug: "harinas-premezclas",
    name: "Harinas y premezclas",
    description: "Harinas de trigo, integrales, premezclas, avena, salvado y pellets para pan y repostería.",
  },
  {
    slug: "levaduras-mejoradores",
    name: "Levaduras y mejoradores",
    description: "Levaduras, mejoradores, antimoho, polvo para hornear, bicarbonato y cremor.",
  },
  {
    slug: "azucar-sal-condimentos",
    name: "Azúcar, sal y condimentos",
    description: "Azúcar, glasé, sal, glicerina y condimentos para tu producción.",
  },
  {
    slug: "grasas-lacteos",
    name: "Grasas y lácteos",
    description: "Margarinas, leche, leche condensada, queso y grasas para panadería.",
  },
  {
    slug: "rellenos-coberturas",
    name: "Rellenos y coberturas",
    description: "Arequipe, bocadillo, mermeladas, rellenos, chocolatería, coberturas, gelatinas y galletas.",
  },
  {
    slug: "frutas-frutos-secos",
    name: "Frutas y frutos secos",
    description: "Almendras, frutos secos, frutas cristalizadas, cerezas, duraznos, brevas, uva pasa y coco.",
  },
  {
    slug: "esencias-colores-decoracion",
    name: "Esencias, colores y decoración",
    description: "Esencias, colorantes, grageas, velas, obleas y adornos para decorar tortas y postres.",
  },
  {
    slug: "moldes-capacillos",
    name: "Moldes y capacillos",
    description: "Moldes de aluminio y silicona, discos y capacillos de todos los tamaños.",
  },
  {
    slug: "reposteria-utensilios",
    name: "Repostería y utensilios",
    description: "Herramientas, boquillas, mangas, cortadores, rodillos, dotación y accesorios de repostería.",
  },
  {
    slug: "empaques-desechables",
    name: "Empaques y desechables",
    description: "Bolsas, cajas, envolturas, vasos, envases y desechables para empacar tus productos.",
  },
  {
    slug: "vinos-licores",
    name: "Vinos para repostería",
    description: "Vinos y licores para la elaboración de tortas, ponqués y postres.",
  },
];

/** Categoría original del Excel (DescGrupoUno) → slug de departamento. */
export const CATEGORY_TO_DEPARTMENT: Record<string, string> = {
  HARINAS: "harinas-premezclas",
  PREMEZCLAS: "harinas-premezclas",
  AVENA: "harinas-premezclas",
  SALVADO: "harinas-premezclas",
  PELLETS: "harinas-premezclas",

  LEVADURA: "levaduras-mejoradores",
  MEJORADORES: "levaduras-mejoradores",
  ANTIMOHO: "levaduras-mejoradores",
  "POLVO PARA HORNEAR": "levaduras-mejoradores",
  BICARBONATO: "levaduras-mejoradores",
  CREMOR: "levaduras-mejoradores",

  AZUCAR: "azucar-sal-condimentos",
  SAL: "azucar-sal-condimentos",
  GLASSE: "azucar-sal-condimentos",
  GLICERINA: "azucar-sal-condimentos",
  CONDIMENTOS: "azucar-sal-condimentos",

  MARGARINAS: "grasas-lacteos",
  LECHE: "grasas-lacteos",
  "LECHE CONDENSADA": "grasas-lacteos",
  QUESO: "grasas-lacteos",
  HYVOL: "grasas-lacteos",

  AREQUIPE: "rellenos-coberturas",
  BOCADILLO: "rellenos-coberturas",
  MERMELADAS: "rellenos-coberturas",
  RELLENOS: "rellenos-coberturas",
  COBERTURA: "rellenos-coberturas",
  CHOCOLATERIA: "rellenos-coberturas",
  GELATINA: "rellenos-coberturas",
  GALLETAS: "rellenos-coberturas",

  "FRUTOS SECOS": "frutas-frutos-secos",
  ALMENDRAS: "frutas-frutos-secos",
  "FRUTAS CRISTALIZADAS": "frutas-frutos-secos",
  CEREZAS: "frutas-frutos-secos",
  DURAZNOS: "frutas-frutos-secos",
  BREVAS: "frutas-frutos-secos",
  CIRUELAS: "frutas-frutos-secos",
  "UVA PASA": "frutas-frutos-secos",
  COCO: "frutas-frutos-secos",
  "COCTAIL DE FRUTAS": "frutas-frutos-secos",

  ESENCIAS: "esencias-colores-decoracion",
  COLORES: "esencias-colores-decoracion",
  GRAGEAS: "esencias-colores-decoracion",
  VELAS: "esencias-colores-decoracion",
  OBLEAS: "esencias-colores-decoracion",

  MOLDES: "moldes-capacillos",
  DISCOS: "moldes-capacillos",
  CAPACILLOS: "moldes-capacillos",

  REPOSTERIA: "reposteria-utensilios",
  LIBROS: "reposteria-utensilios",
  "VARIOS 900": "reposteria-utensilios",

  BOLSAS: "empaques-desechables",
  CAJAS: "empaques-desechables",
  DESECHABLES: "empaques-desechables",
  ENVOLTURAS: "empaques-desechables",
  VASOS: "empaques-desechables",
  ENVASES: "empaques-desechables",

  VINOS: "vinos-licores",
};

/**
 * Reglas por palabras clave. Se aplican en orden, solo a productos de
 * "VARIOS 900" o sin categoría, sobre el nombre en MAYÚSCULAS.
 */
export const KEYWORD_RULES: { test: RegExp; department: string }[] = [
  { test: /\b(CMC)\b/, department: "levaduras-mejoradores" },
  { test: /\b(MOLDE|MOLDES|CAPACILLO|PORTACAPACILLO|PORTACAPACILLOS)\b/, department: "moldes-capacillos" },
  { test: /\b(GRAGEA|GRAGEAS)\b/, department: "esencias-colores-decoracion" },
  { test: /\b(ALMENDRA|ALMENDRAS)\b/, department: "frutas-frutos-secos" },
  {
    test: /\b(STICKERS?|ADORNO|PAYASO|BLANCA NIEVES|CANCHAS?|POLVO DORADO|LAZOS?|PICKS?|TARJE|COLUMNA|CONOS?|PLANTILLA|PUSH UP|PALOS? (BLANCO|COLOR))\b/,
    department: "esencias-colores-decoracion",
  },
  {
    test: /\b(BOLSA|BOLSAS|CAJA|CAJAS|SERVILLETAS?|ENVOLTURA|MESA PONQUE|MALLAS|PRECORTADO)\b/,
    department: "empaques-desechables",
  },
];

/**
 * Reglas fijas: corrigen productos mal archivados en el Excel. Se aplican a TODOS
 * los productos y tienen prioridad sobre la categoría original.
 */
export const FORCED_RULES: { test: RegExp; department: string }[] = [
  { test: /\bPOLVO DORADO\b/, department: "esencias-colores-decoracion" },
  { test: /^DISCOS? (DORADO|PLATEADO|BLANCO|NEGRO|ROJO)\b/, department: "moldes-capacillos" },
];

/** Departamento por defecto cuando ninguna regla coincide. */
export const FALLBACK_DEPARTMENT = "reposteria-utensilios";

/** Palabras en MAYÚSCULAS sin tilde → forma correcta. Ampliable. */
export const ACCENT_WORDS: Record<string, string> = {
  AZUCAR: "Azúcar",
  REPOSTERIA: "Repostería",
  PANADERIA: "Panadería",
  LIMON: "Limón",
  MARACUYA: "Maracuyá",
  CAFE: "Café",
  MANI: "Maní",
  ACIDO: "Ácido",
  AJONJOLI: "Ajonjolí",
  FRANCES: "Francés",
  FECULA: "Fécula",
  GLASE: "Glasé",
  PLASTICA: "Plástica",
  PLASTICO: "Plástico",
  PLASTICOS: "Plásticos",
  ACRILICO: "Acrílico",
  ESPATULA: "Espátula",
  TERMOMETRO: "Termómetro",
  MAQUINA: "Máquina",
  PONQUE: "Ponqué",
  ROSCON: "Roscón",
  BEBES: "Bebés",
  LAMINA: "Lámina",
  DECORACION: "Decoración",
  CARTON: "Cartón",
  COMUNION: "Comunión",
  LIQUIDO: "Líquido",
  FUTBOL: "Fútbol",
  ARANDANO: "Arándano",
  ARANDANOS: "Arándanos",
  MAGICO: "Mágico",
  ELECTRICO: "Eléctrico",
  NUTRICION: "Nutrición",
  MARGARINA: "Margarina",
  GRANULADO: "Granulado",
  SODIO: "Sodio",
  CREMA: "Crema",
  GELATINA: "Gelatina",
  VAINILLA: "Vainilla",
  ESENCIA: "Esencia",
  CEREZA: "Cereza",
  CEREZAS: "Cerezas",
  DURAZNO: "Durazno",
  MANZANA: "Manzana",
  PINA: "Piña",
  CANELA: "Canela",
  ALMIDON: "Almidón",
  GLUTEN: "Gluten",
  MERENGUE: "Merengue",
  CROASANT: "Croissant",
  CAPSULA: "Cápsula",
  PASTEL: "Pastel",
  TAPABOCAS: "Tapabocas",
  GRAMERA: "Gramera",
  BASCULA: "Báscula",
  ELASTICO: "Elástico",
  ULTRA: "Ultra",
  MEDICION: "Medición",
  ARTICULO: "Artículo",
  ACETATO: "Acetato",
  SILICONA: "Silicona",
  TRANSPARENTE: "Transparente",
  METALIZADA: "Metalizada",
};

/** Palabras que quedan en minúscula en el nombre limpio. */
export const LOWERCASE_WORDS = new Set([
  "de", "del", "la", "las", "el", "los", "y", "e", "o", "u", "a", "con", "sin", "para", "por", "en", "al", "x",
]);

/** Siglas y códigos que deben quedar en MAYÚSCULAS aunque tengan vocales. */
export const KEEP_UPPER = new Set(["SAS", "LTDA", "SA", "PET", "UHT", "PVC", "LED", "ABC", "PP", "PQX", "COLR", "UV", "OPP", "BOPP"]);

/** Nombres presentables para subcategorías cuyo título automático no basta. */
export const SUBCATEGORY_NAMES: Record<string, string> = {
  GLASSE: "Glasé",
  "COCTAIL DE FRUTAS": "Cóctel de frutas",
  CHOCOLATERIA: "Chocolatería",
  "VARIOS 900": "Varios",
  HYVOL: "Hyvol",
  AZUCAR: "Azúcar",
  REPOSTERIA: "Repostería",
  "UVA PASA": "Uva pasa",
  "POLVO PARA HORNEAR": "Polvo para hornear",
  "LECHE CONDENSADA": "Leche condensada",
  "FRUTAS CRISTALIZADAS": "Frutas cristalizadas",
  "FRUTOS SECOS": "Frutos secos",
};
