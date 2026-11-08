import Link from "next/link";
import { AddToCart } from "@/components/catalog/add-to-cart";
import { ProductImage } from "@/components/catalog/product-image";
import { formatCOP } from "@/lib/format";
import type { CompactProduct } from "@/types/catalog";

const unitNote = { un: "", kg: " / kg", g: " / g" } as const;

export function ProductCard({
  product,
  priority,
  headingLevel: Heading = "h2",
}: {
  product: CompactProduct;
  priority?: boolean;
  /** h2 en listados bajo un h1; h3 cuando la tarjeta está dentro de una sección con h2. */
  headingLevel?: "h2" | "h3";
}) {
  const href = `/productos/${product.d}/${product.s}`;
  const priceText =
    product.p === null
      ? null
      : product.u === "g" && product.p % 1 !== 0
        ? `$ ${String(product.p).replace(".", ",")}`
        : formatCOP(product.p);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <Link href={href} tabIndex={-1} aria-hidden="true">
        <ProductImage
          src={product.i}
          alt={product.n}
          department={product.d}
          priority={priority}
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <div className="flex-1">
          <Heading className="font-display text-[0.95rem] font-bold leading-snug sm:text-base">
            <Link href={href} className="hover:text-accent">
              {product.n}
            </Link>
          </Heading>
          {product.b ? <p className="mt-1 text-xs text-muted">{product.b}</p> : null}
        </div>
        <p className="tabular font-display text-xl font-extrabold leading-none">
          {priceText ?? <span className="text-base font-bold text-muted">Precio por consultar</span>}
          {priceText ? <span className="text-sm font-semibold text-muted">{unitNote[product.u]}</span> : null}
        </p>
        <AddToCart product={product} compact />
      </div>
    </article>
  );
}
