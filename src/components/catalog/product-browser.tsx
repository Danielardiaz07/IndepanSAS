"use client";

import { useMemo, useState } from "react";
import MiniSearch from "minisearch";
import { Search, X } from "lucide-react";
import { ProductCard } from "@/components/catalog/product-card";
import { useCompactCatalog } from "@/lib/compact-catalog";
import { useUrlQuery } from "@/lib/url-query";
import { trackEvent } from "@/lib/analytics";
import type { CompactProduct } from "@/types/catalog";

const PAGE = 24;

type Sort = "relevance" | "name" | "price-asc" | "price-desc";

interface Props {
  /** Primeros productos, renderizados en el servidor para el HTML inicial. */
  initial: CompactProduct[];
  /** Total del alcance (departamento o catálogo completo). */
  initialTotal: number;
  /** Si se define, el navegador queda limitado a ese departamento. */
  departmentSlug?: string;
  /** Departamentos para filtrar cuando no hay uno fijo. */
  departments?: { slug: string; name: string; count: number }[];
  /** Subcategorías del departamento fijo. */
  subcategories?: { name: string; count: number }[];
  heading?: string;
}

const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function ProductBrowser({
  initial,
  initialTotal,
  departmentSlug,
  departments,
  subcategories,
  heading,
}: Props) {
  const [query, setQuery] = useUrlQuery();
  const [dept, setDept] = useState<string | null>(departmentSlug ?? null);
  const [sub, setSub] = useState<string | null>(null);
  const [brand, setBrand] = useState<string>("");
  const [sort, setSort] = useState<Sort>("name");
  const [visible, setVisible] = useState(PAGE);
  const [interacted, setInteracted] = useState(false);
  // Una búsqueda en la URL (?q=) activa el catálogo completo desde el primer momento
  const engaged = interacted || query.trim() !== "";

  const catalog = useCompactCatalog(engaged);

  const index = useMemo(() => {
    if (!catalog) return null;
    const ms = new MiniSearch<CompactProduct>({
      idField: "c",
      fields: ["n", "b", "sc"],
      processTerm: (t) => strip(t),
      searchOptions: { prefix: true, fuzzy: 0.15, combineWith: "AND", boost: { n: 3 } },
    });
    ms.addAll(catalog);
    return ms;
  }, [catalog]);

  const results = useMemo(() => {
    if (!catalog || !index) return null;
    const byCode = new Map(catalog.map((p) => [p.c, p]));
    const q = query.trim();
    let list: CompactProduct[];
    let relevance = new Map<string, number>();
    if (q) {
      const hits = index.search(q);
      relevance = new Map(hits.map((h, i) => [h.id as string, i]));
      list = hits.map((h) => byCode.get(h.id as string)!).filter(Boolean);
    } else {
      list = catalog;
    }
    if (dept) list = list.filter((p) => p.d === dept);
    if (sub) list = list.filter((p) => p.sc === sub);
    if (brand) list = list.filter((p) => p.b === brand);

    const sorted = [...list];
    const effective: Sort = sort === "relevance" && !q ? "name" : sort;
    if (effective === "relevance") sorted.sort((a, b) => relevance.get(a.c)! - relevance.get(b.c)!);
    else if (effective === "name") {
      if (q) sorted.sort((a, b) => relevance.get(a.c)! - relevance.get(b.c)!);
      else sorted.sort((a, b) => a.n.localeCompare(b.n, "es"));
    } else {
      const dir = effective === "price-asc" ? 1 : -1;
      sorted.sort((a, b) => {
        if (a.p === null && b.p === null) return 0;
        if (a.p === null) return 1;
        if (b.p === null) return -1;
        return (a.p - b.p) * dir;
      });
    }
    return sorted;
  }, [catalog, index, query, dept, sub, brand, sort]);

  const brands = useMemo(() => {
    if (!catalog || !dept) return [];
    return [...new Set(catalog.filter((p) => p.d === dept && (!sub || p.sc === sub)).map((p) => p.b).filter(Boolean))].sort(
      (a, b) => a!.localeCompare(b!, "es"),
    ) as string[];
  }, [catalog, dept, sub]);

  const usingServerList = !engaged || !results;
  const list = usingServerList ? initial : results;
  const total = usingServerList ? initialTotal : results.length;
  const shown = list.slice(0, visible);
  const loading = engaged && !catalog;
  const filtered = Boolean(query.trim() || sub || brand || (dept && !departmentSlug));

  function engage() {
    if (!interacted) setInteracted(true);
  }

  function resetPaging() {
    setVisible(PAGE);
  }

  function clearAll() {
    setQuery("");
    setSub(null);
    setBrand("");
    if (!departmentSlug) setDept(null);
    resetPaging();
  }

  return (
    <section aria-label={heading ?? "Catálogo de productos"}>
      <div className="sticky top-16 z-20 -mx-4 border-b border-line bg-ground/95 px-4 py-3 backdrop-blur-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <label htmlFor="buscar" className="sr-only">
            Buscar productos
          </label>
          <input
            id="buscar"
            type="search"
            value={query}
            onFocus={engage}
            onChange={(e) => {
              engage();
              setQuery(e.target.value);
              resetPaging();
              if (e.target.value.length === 3) trackEvent("search", { search_term: e.target.value });
            }}
            placeholder={departmentSlug ? "Buscar en este departamento…" : "Buscar harina, levadura, molde, bolsa…"}
            autoComplete="off"
            enterKeyHint="search"
            className="h-12 w-full rounded-full border border-line bg-surface pl-12 pr-12 text-base font-medium placeholder:text-muted/80"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                resetPaging();
              }}
              className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full hover:bg-sunken"
              aria-label="Borrar búsqueda"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {departments && !departmentSlug ? (
          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" role="group" aria-label="Departamentos">
            <Chip active={dept === null} onClick={() => { engage(); setDept(null); setSub(null); setBrand(""); resetPaging(); }}>
              Todos
            </Chip>
            {departments.map((d) => (
              <Chip
                key={d.slug}
                active={dept === d.slug}
                onClick={() => {
                  engage();
                  setDept(dept === d.slug ? null : d.slug);
                  setSub(null);
                  setBrand("");
                  resetPaging();
                }}
              >
                {d.name}
              </Chip>
            ))}
          </div>
        ) : null}

        {(subcategories && subcategories.length > 1) || brands.length > 1 ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {subcategories && subcategories.length > 1 ? (
              <div className="-mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" role="group" aria-label="Subcategorías">
                <Chip active={sub === null} onClick={() => { engage(); setSub(null); setBrand(""); resetPaging(); }}>
                  Todas
                </Chip>
                {subcategories.map((s) => (
                  <Chip
                    key={s.name}
                    active={sub === s.name}
                    onClick={() => {
                      engage();
                      setSub(sub === s.name ? null : s.name);
                      setBrand("");
                      resetPaging();
                    }}
                  >
                    {s.name} <span className="tabular opacity-60">{s.count}</span>
                  </Chip>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <p role="status" aria-live="polite" className="tabular font-semibold">
            {loading ? "Buscando en el catálogo…" : `${total} ${total === 1 ? "producto" : "productos"}`}
          </p>
          {brands.length > 1 ? (
            <label className="flex items-center gap-2">
              <span className="text-muted">Marca</span>
              <select
                value={brand}
                onChange={(e) => {
                  engage();
                  setBrand(e.target.value);
                  resetPaging();
                }}
                className="h-9 max-w-44 rounded-full border border-line bg-surface px-3 text-sm font-semibold"
              >
                <option value="">Todas</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label className="flex items-center gap-2">
            <span className="text-muted">Ordenar</span>
            <select
              value={sort}
              onChange={(e) => {
                engage();
                setSort(e.target.value as Sort);
                resetPaging();
              }}
              className="h-9 rounded-full border border-line bg-surface px-3 text-sm font-semibold"
            >
              <option value="name">{query.trim() ? "Más relevantes" : "Nombre (A-Z)"}</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </label>
          {filtered ? (
            <button type="button" onClick={clearAll} className="font-bold text-accent underline underline-offset-4">
              Limpiar filtros
            </button>
          ) : null}
        </div>
      </div>

      <div className="pt-5">
        {shown.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {shown.map((p, i) => (
              <li key={p.c}>
                <ProductCard product={p} priority={i < 4} />
              </li>
            ))}
          </ul>
        ) : loading ? (
          <p className="py-16 text-center text-muted">Cargando…</p>
        ) : (
          <div className="rounded-2xl border border-dashed border-line px-6 py-14 text-center">
            <p className="font-display text-xl font-bold">No encontramos “{query.trim()}”</p>
            <p className="mt-2 text-muted">
              Prueba con otra palabra o escríbenos por WhatsApp: puede que lo tengamos y no esté publicado.
            </p>
            <button type="button" onClick={clearAll} className="mt-5 h-11 rounded-full bg-btn px-6 font-bold text-on-btn">
              Ver todos los productos
            </button>
          </div>
        )}

        {shown.length < total ? (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                engage();
                setVisible((v) => v + PAGE);
              }}
              className="h-12 rounded-full border-2 border-ink px-8 font-bold transition-colors hover:bg-sunken"
            >
              Ver más productos
              <span className="tabular ml-2 text-muted">
                {shown.length} de {total}
              </span>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-10 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-bold transition-colors ${
        active ? "border-transparent bg-btn text-on-btn" : "border-line bg-surface hover:bg-sunken"
      }`}
    >
      {children}
    </button>
  );
}
