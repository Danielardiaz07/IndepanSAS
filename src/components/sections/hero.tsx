import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Search } from "lucide-react";
import { contactUrl } from "@/lib/whatsapp";
import { departmentPath } from "@/lib/seo";
import type { Department } from "@/types/catalog";

/** Nombres cortos para los accesos rápidos del móvil. */
const shortNames: Record<string, string> = {
  "harinas-premezclas": "Harinas",
  "levaduras-mejoradores": "Levaduras",
  "azucar-sal-condimentos": "Azúcar y sal",
  "grasas-lacteos": "Grasas y lácteos",
  "rellenos-coberturas": "Rellenos",
  "frutas-frutos-secos": "Frutas y secos",
  "esencias-colores-decoracion": "Esencias y colores",
  "moldes-capacillos": "Moldes",
  "reposteria-utensilios": "Utensilios",
  "empaques-desechables": "Empaques",
  "vinos-licores": "Vinos",
};

export function Hero({ departments }: { departments: Department[] }) {
  return (
    <section className="relative overflow-hidden bg-brand text-on-brand">
      {/* Círculo del logo ampliado: ancla la composición sin repetir la ilustración */}
      <div
        className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-brand-hot/35 md:-right-24 md:-top-40 md:size-[46rem]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 pb-10 pt-8 md:grid-cols-[1.15fr_0.85fr] md:gap-10 md:pb-24 md:pt-16">
        <div>
          <h1
            className="hero-rise font-display text-[2.1rem] font-extrabold leading-[1.04] tracking-tight text-balance sm:text-6xl lg:text-[4.4rem] lg:leading-[0.98]"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            Insumos de panadería y repostería en Valledupar
          </h1>
          <p
            className="hero-rise mt-3 max-w-xl text-base font-medium leading-relaxed text-pretty sm:mt-5 sm:text-xl"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            Más de 10 años abasteciendo a panaderos y reposteros. Arma tu pedido aquí y envíalo listo por WhatsApp.
          </p>

          <form
            action="/productos"
            method="get"
            role="search"
            className="hero-rise mt-6 flex max-w-xl overflow-hidden rounded-full bg-surface p-1.5 shadow-card sm:mt-8"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            <label htmlFor="hero-q" className="sr-only">
              Buscar insumos
            </label>
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                id="hero-q"
                name="q"
                type="search"
                autoComplete="off"
                enterKeyHint="search"
                placeholder="Buscar insumos…"
                className="h-12 w-full bg-transparent pl-12 pr-2 text-base font-medium text-ink placeholder:text-muted"
              />
            </div>
            <button
              type="submit"
              className="h-12 shrink-0 rounded-full bg-btn px-6 text-base font-bold text-on-btn transition-transform active:scale-95"
            >
              Buscar
            </button>
          </form>

          <div
            className="hero-rise mt-4 grid max-w-xl grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-4"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            <Link
              href="/productos"
              className="group flex h-12 items-center justify-center gap-2 rounded-full bg-on-brand px-4 text-base font-extrabold text-brand sm:px-6"
            >
              Ver productos
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <a
              href={contactUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-full border-2 border-on-brand px-4 text-base font-bold transition-colors hover:bg-on-brand hover:text-brand sm:px-6"
            >
              <MessageCircle className="size-5" aria-hidden="true" />
              Escríbenos
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </div>

          {/* Accesos rápidos: en móvil llevan al producto en un toque */}
          <nav
            aria-label="Departamentos"
            className="hero-rise -mx-4 mt-6 sm:hidden"
            style={{ "--i": 4 } as React.CSSProperties}
          >
            <ul className="flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
              {departments.map((d) => (
                <li key={d.slug} className="shrink-0">
                  <Link
                    href={departmentPath(d.slug)}
                    className="flex h-11 items-center rounded-full border border-on-brand/35 bg-white/40 px-4 text-sm font-bold whitespace-nowrap"
                  >
                    {shortNames[d.slug] ?? d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* La mascota se reserva para pantallas con espacio; en móvil el logo ya está en el encabezado */}
        <div className="relative mx-auto hidden w-full max-w-sm md:block md:max-w-none">
          <Image
            src="/brand/logo-1024.webp"
            alt="Chef de Indepan sosteniendo una dona y un pan"
            width={640}
            height={640}
            sizes="40vw"
            className="hero-pop mx-auto h-auto w-full max-w-[26rem] drop-shadow-[0_18px_28px_rgb(43_23_16/0.28)]"
          />
        </div>
      </div>
    </section>
  );
}
