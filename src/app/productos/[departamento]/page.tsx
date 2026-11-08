import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductBrowser } from "@/components/catalog/product-browser";
import { JsonLd } from "@/components/ui/json-ld";
import { getDepartment, getDepartments, getProductsByDepartment, toCompact } from "@/lib/catalog";
import { breadcrumbJsonLd, departmentJsonLd, departmentPath } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getDepartments().map((d) => ({ departamento: d.slug }));
}

type Props = { params: Promise<{ departamento: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { departamento } = await params;
  const dept = getDepartment(departamento);
  if (!dept) return {};
  const title = `${dept.name} en Valledupar`;
  const description = `${dept.description} ${dept.count} productos con precios y pedido por WhatsApp en Indepan SAS, Valledupar.`;
  return {
    title,
    description,
    alternates: { canonical: departmentPath(dept.slug) },
    openGraph: { title, description, url: departmentPath(dept.slug) },
  };
}

export default async function DepartmentPage({ params }: Props) {
  const { departamento } = await params;
  const dept = getDepartment(departamento);
  if (!dept) notFound();

  const products = getProductsByDepartment(dept.slug);
  const initial = products.slice(0, 24).map(toCompact);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-8 md:pt-12">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Productos", path: "/productos" },
            { name: dept.name, path: departmentPath(dept.slug) },
          ]),
          departmentJsonLd(dept, products),
        ]}
      />
      <nav aria-label="Ruta de navegación" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li>
            <Link href="/" className="hover:text-ink hover:underline">
              Inicio
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/productos" className="hover:text-ink hover:underline">
              Productos
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-ink">
            {dept.name}
          </li>
        </ol>
      </nav>

      <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl">
        {dept.name} en Valledupar
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-muted text-pretty">
        {dept.description} Agrega al pedido y envíalo por WhatsApp a Indepan SAS.
      </p>

      <div className="mt-6">
        <ProductBrowser
          initial={initial}
          initialTotal={dept.count}
          departmentSlug={dept.slug}
          subcategories={dept.subcategories.map((s) => ({ name: s.name, count: s.count }))}
          heading={dept.name}
        />
      </div>
    </div>
  );
}
