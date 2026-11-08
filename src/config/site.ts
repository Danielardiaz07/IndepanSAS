export interface Hours {
  label: string;
  time: string;
  schemaDays: string[];
  opens: string | null;
  closes: string | null;
}

/** Datos del negocio. Única fuente para nombre, contacto, horarios y redes. */
export const site = {
  name: "Indepan SAS",
  shortName: "Indepan",
  tagline: "Insumos de panadería y repostería",
  description:
    "Insumos de panadería y repostería en Valledupar, Cesar: harinas, levaduras, margarinas, rellenos, moldes, empaques y más. Arma tu pedido y envíalo por WhatsApp.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "es_CO",
  foundedNote: "Más de 10 años apoyando a emprendedores en Valledupar",

  whatsapp: {
    /** Formato internacional sin "+". */
    number: "573006739631",
    display: "300 673 9631",
    greeting: "Hola Indepan, quisiera más información sobre sus productos.",
  },

  address: {
    street: "Calle 21 #17-39",
    sector: "Mercado",
    city: "Valledupar",
    region: "Cesar",
    country: "CO",
    full: "Calle 21 #17-39, sector Mercado, Valledupar, Cesar",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Calle+21+%2317-39+Valledupar+Cesar",
    mapsEmbedUrl: "https://maps.google.com/maps?q=Calle%2021%20%2317-39%2C%20Valledupar%2C%20Cesar&output=embed",
  },

  hours: [
    { label: "Lunes a viernes", time: "6:30 a. m. – 4:00 p. m.", schemaDays: ["Mo", "Tu", "We", "Th", "Fr"], opens: "06:30", closes: "16:00" },
    { label: "Sábado", time: "6:30 a. m. – 3:00 p. m.", schemaDays: ["Sa"], opens: "06:30", closes: "15:00" },
    { label: "Domingo", time: "Sin servicio", schemaDays: [], opens: null, closes: null },
  ] as Hours[],

  payments: ["Efectivo", "Transferencia bancaria", "Código QR"],

  social: {
    instagram: "https://www.instagram.com/insumosindepan/",
    facebook: "https://www.facebook.com/indepan.sas.39",
  },

  currency: { code: "COP", locale: "es-CO" },

  /** Fecha de corte de los precios del catálogo. Actualizar al cargar un Excel nuevo. */
  priceCutoff: { iso: "2026-09-30", label: "30 de septiembre de 2026" },

  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
  },
} as const;

export type Site = typeof site;
