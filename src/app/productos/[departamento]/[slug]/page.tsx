import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { AddToCart } from "@/components/catalog/add-to-cart";
import { ProductCard } from "@/components/catalog/product-card";
import { ProductImage } from "@/components/catalog/product-image";
import { JsonLd } from "@/components/ui/json-ld";
import { site } from "@/config/site";
import { getAllProducts, getDepartment, getProduct, relatedProducts, toCompact } from "@/lib/catalog";
import { formatUnitPrice } from "@/lib/format";
import { breadcrumbJsonLd, departmentPath, productJsonLd, productPath } from "@/lib/seo";
import { priceInquiryUrl } from "@/lib/whatsapp";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ departamento: p.department, slug: p.slug }));
}

type Props = { params: Promise<{ departamento: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { departamento, slug } = await params;
  const p = getProduct(departamento, slug);
  if (!p) return {};
  const dept = getDepartment(p.department);
  const title = `${p.name}${p.brand ? ` – ${p.brand}` : ""}`;
  const description = `Compra ${p.name} en Valledupar${dept ? ` (${dept.name.toLowerCase()})` : ""}. Agrégalo a tu pedido y envíalo por WhatsApp a Indepan SAS.`;
  return {
    title,
    description,
    alternates: { canonical: productPath(p) },
    // Solo se indexan productos con precio publicado
    robots: p.price === null ? { index: false, follow: true } : undefined,
    openGraph: { title, description, url: productPath(p), ...(p.image ? { images: [p.image] } : {}) },
  };
}

export default async function ProductPage({ params }: Props) {
  const { departamento, slug } = await params;
  const p = getProduct(departamento, slug);
  if (!p) notFound();
  const dept = getDepartment(p.department)!;
  const compact = toCompact(p);
  const related = relatedProducts(p, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-8 md:pt-12">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Productos", path: "/productos" },
            { name: dept.name, path: departmentPath(dept.slug) },
            { name: p.name, path: productPath(p) },
          ]),
          productJsonLd(p, dept.name),
        ]}
      />

      <nav aria-label="Ruta de navegación" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li>
            <Link href="/productos" className="hover:text-ink hover:underline">
              Productos
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={departmentPath(dept.slug)} className="hover:text-ink hover:underline">
              {dept.name}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        <ProductImage
          src={p.image}
          alt={p.name}
          department={p.department}
          sizes="(min-width: 768px) 45vw, 100vw"
          priority
          className="rounded-3xl"
        />

        <div>
          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-4xl">
            {p.name}
          </h1>
          {p.brand ? <p className="mt-2 text-lg text-muted">Marca {p.brand}</p> : null}

          <p className="tabular mt-6 font-display text-4xl font-extrabold">
            {p.price === null ? (
              <span className="text-2xl text-muted">Precio por consultar</span>
            ) : (
              formatUnitPrice(p.price, p.unit)
            )}
          </p>
          {p.price !== null ? (
            <p className="mt-1 text-sm text-muted">
              Precio referencial, corte del {site.priceCutoff.label}. Te confirmamos el valor final por WhatsApp.
            </p>
          ) : null}

          <div className="mt-6 max-w-sm">
            <AddToCart product={compact} />
          </div>

          <dl className="mt-8 grid max-w-sm grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-line pt-6 text-sm">
            <dt className="text-muted">Departamento</dt>
            <dd className="font-semibold">
              <Link href={departmentPath(dept.slug)} className="hover:underline">
                {dept.name}
              </Link>
            </dd>
            <dt className="text-muted">Categoría</dt>
            <dd className="font-semibold">{p.subcategory}</dd>
            {p.size ? (
              <>
                <dt className="text-muted">Presentación</dt>
                <dd className="font-semibold">{p.size}</dd>
              </>
            ) : null}
            <dt className="text-muted">Código</dt>
            <dd className="tabular font-semibold">{p.code}</dd>
            <dt className="text-muted">Disponibilidad</dt>
            <dd className="font-semibold">{p.available ? "Disponible" : "Agotado"}</dd>
          </dl>

          {p.description ? <p className="mt-6 max-w-prose leading-relaxed">{p.description}</p> : null}

          <a
            href={priceInquiryUrl(p.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border-2 border-ink px-5 text-sm font-bold transition-colors hover:bg-sunken"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Preguntar por este producto
          </a>
        </div>
      </div>

      {related.length > 0 ? (
        <section aria-labelledby="relacionados" className="mt-16">
          <h2 id="relacionados" className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Más de {p.subcategory.toLowerCase()}
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((r) => (
              <li key={r.code}>
                <ProductCard product={toCompact(r)} headingLevel="h3" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
