import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductBrowser } from "@/components/catalog/product-browser";
import { JsonLd } from "@/components/ui/json-ld";
import { getAllProducts, getDepartments, sampleAcrossDepartments, toCompact } from "@/lib/catalog";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Catálogo de insumos de panadería y repostería",
  description:
    "Más de 970 insumos para panadería y repostería en Valledupar: harinas, levaduras, margarinas, rellenos, frutos secos, moldes, capacillos y empaques. Busca y arma tu pedido por WhatsApp.",
  alternates: { canonical: "/productos" },
};

export default function ProductsPage() {
  const departments = getDepartments();
  const total = getAllProducts().length;
  const initial = sampleAcrossDepartments(2).map(toCompact);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-10 md:pt-14">
      <JsonLd data={breadcrumbJsonLd([{ name: "Inicio", path: "/" }, { name: "Productos", path: "/productos" }])} />
      <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl">
        Catálogo de insumos
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-muted text-pretty">
        {total} productos para panadería y repostería. Busca por nombre, filtra por departamento y agrega al pedido.
      </p>
      <div className="mt-6">
        <Suspense fallback={null}>
          <ProductBrowser
            initial={initial}
            initialTotal={total}
            departments={departments.map((d) => ({ slug: d.slug, name: d.name, count: d.count }))}
          />
        </Suspense>
      </div>
    </div>
  );
}
