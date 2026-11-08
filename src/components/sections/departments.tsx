import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DepartmentIcon } from "@/components/ui/icons";
import { departmentPath } from "@/lib/seo";
import type { Department } from "@/types/catalog";

/** Cada departamento toma un color de la paleta; el texto se mantiene legible en cada uno. */
const tones = [
  "bg-brand text-on-brand",
  "bg-kraft text-ink",
  "bg-brown text-on-brown",
  "bg-sun text-ink",
  "bg-surface text-ink border border-line",
  "bg-blush text-ink",
] as const;

/** Ocupación en una grilla de 6 columnas; cada fila suma 6 con 11 departamentos. */
const spans = [3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 6] as const;
const spanClass: Record<number, string> = { 2: "lg:col-span-2", 3: "lg:col-span-3", 6: "lg:col-span-6" };
/** En móvil (2 columnas) el último departamento ocupa el ancho completo para no quedar huérfano. */
const lastMobile = "col-span-2 sm:col-span-1";

export function Departments({ departments }: { departments: Department[] }) {
  return (
    <section aria-labelledby="departamentos" className="mx-auto max-w-6xl px-4 pt-14 md:pt-28">
      <div className="max-w-2xl">
        <h2 id="departamentos" className="font-display text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl">
          Todo lo que tu horno necesita, por departamento
        </h2>
        <p className="mt-3 text-base text-muted text-pretty sm:mt-4 sm:text-lg">
          Desde harinas y levaduras hasta moldes, empaques y decoración. Entra a un departamento o usa el buscador.
        </p>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 lg:grid-cols-6">
        {departments.map((d, i) => {
          return (
            <li key={d.slug} className={`${i === departments.length - 1 ? lastMobile : ""} ${spanClass[spans[i] ?? 2]}`}>
              <Link
                href={departmentPath(d.slug)}
                className={`group relative flex h-full min-h-36 flex-col justify-between overflow-hidden rounded-2xl p-4 sm:min-h-44 sm:rounded-3xl sm:p-6 transition-transform duration-300 hover:-translate-y-1 ${tones[i % tones.length]}`}
              >
                <DepartmentIcon
                  slug={d.slug}
                  className="absolute -bottom-4 -right-4 size-24 opacity-15 sm:-bottom-6 sm:-right-6 sm:size-36 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
                  strokeWidth={1.25}
                />
                <div className="relative flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-extrabold leading-tight text-balance sm:text-[1.7rem]">{d.name}</h3>
                  <ArrowUpRight className="mt-0.5 hidden size-6 shrink-0 sm:block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </div>
                <div className="relative mt-4 sm:mt-6">
                  <p className="hidden text-sm font-medium opacity-90 sm:block">
                    {d.subcategories
                      .slice(0, 3)
                      .map((s) => s.name)
                      .join(" · ")}
                  </p>
                  <p className="tabular mt-1 text-sm font-bold">{d.count} productos</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
