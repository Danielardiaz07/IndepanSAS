import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Search } from "lucide-react";
import { contactUrl } from "@/lib/whatsapp";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand text-on-brand">
      {/* Círculo del logo ampliado: ancla la composición sin repetir la ilustración */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full bg-brand-hot/35 md:-right-24 md:size-[46rem]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 pb-16 pt-10 md:grid-cols-[1.15fr_0.85fr] md:gap-10 md:pb-24 md:pt-16">
        <div>
          <h1
            className="hero-rise font-display text-[2.6rem] font-extrabold leading-[0.98] tracking-tight text-balance sm:text-6xl lg:text-[4.4rem]"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            Insumos de panadería y repostería en Valledupar
          </h1>
          <p
            className="hero-rise mt-5 max-w-xl text-lg font-medium leading-relaxed text-pretty sm:text-xl"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            Más de 10 años abasteciendo a panaderos y reposteros. Elige tus insumos aquí y envíanos el pedido ya armado por WhatsApp.
          </p>

          <form
            action="/productos"
            method="get"
            role="search"
            className="hero-rise mt-8 flex max-w-xl overflow-hidden rounded-full bg-surface p-1.5 shadow-card"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            <label htmlFor="hero-q" className="sr-only">
              ¿Qué insumo necesitas?
            </label>
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                id="hero-q"
                name="q"
                type="search"
                autoComplete="off"
                enterKeyHint="search"
                placeholder="¿Qué insumo necesitas?"
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
            className="hero-rise mt-5 flex flex-wrap items-center gap-x-5 gap-y-3"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            <Link href="/productos" className="group inline-flex h-12 items-center gap-2 font-extrabold underline decoration-2 underline-offset-4">
              Ver todos los productos
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <a
              href={contactUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-on-brand px-5 font-bold transition-colors hover:bg-on-brand hover:text-brand"
            >
              <MessageCircle className="size-5" aria-hidden="true" />
              Escríbenos
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm md:max-w-none">
          <Image
            src="/brand/logo-1024.webp"
            alt="Chef de Indepan sosteniendo una dona y un pan"
            width={640}
            height={640}
            priority
            sizes="(min-width: 768px) 40vw, 80vw"
            className="hero-pop mx-auto h-auto w-full max-w-[26rem] drop-shadow-[0_18px_28px_rgb(43_23_16/0.28)]"
          />
        </div>
      </div>
    </section>
  );
}
