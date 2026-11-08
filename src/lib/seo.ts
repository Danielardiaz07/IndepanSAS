import { site } from "@/config/site";
import type { Department, Product } from "@/types/catalog";

export function absoluteUrl(path = "/"): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function productPath(p: Pick<Product, "department" | "slug">): string {
  return `/productos/${p.department}/${p.slug}`;
}

export function departmentPath(slug: string): string {
  return `/productos/${slug}`;
}

const dayNames: Record<string, string> = {
  Mo: "Monday",
  Tu: "Tuesday",
  We: "Wednesday",
  Th: "Thursday",
  Fr: "Friday",
  Sa: "Saturday",
  Su: "Sunday",
};

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": absoluteUrl("/#negocio"),
    name: site.name,
    alternateName: site.shortName,
    description: site.description,
    url: site.url,
    image: absoluteUrl("/brand/logo-1024.png"),
    logo: absoluteUrl("/brand/logo-512.png"),
    telephone: `+${site.whatsapp.number}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.street}, ${site.address.sector}`,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    areaServed: { "@type": "City", name: site.address.city },
    currenciesAccepted: site.currency.code,
    paymentAccepted: site.payments.join(", "),
    openingHoursSpecification: site.hours
      .filter((h) => h.opens && h.closes)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.schemaDays.map((d) => dayNames[d]),
        opens: h.opens,
        closes: h.closes,
      })),
    sameAs: [site.social.instagram, site.social.facebook],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function departmentJsonLd(dept: Department, products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${dept.name} en Valledupar`,
    description: dept.description,
    url: absoluteUrl(departmentPath(dept.slug)),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: dept.count,
      itemListElement: products.slice(0, 24).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(productPath(p)),
        name: p.name,
      })),
    },
  };
}

export function productJsonLd(p: Product, departmentName: string) {
  const base = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.code,
    category: departmentName,
    url: absoluteUrl(productPath(p)),
    ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
    ...(p.description ? { description: p.description } : {}),
    ...(p.image ? { image: absoluteUrl(p.image) } : {}),
  };
  if (p.price === null) return base;
  return {
    ...base,
    offers: {
      "@type": "Offer",
      priceCurrency: site.currency.code,
      price: p.price,
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      availability: p.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: site.name },
    },
  };
}
