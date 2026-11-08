import Image from "next/image";
import { site } from "@/config/site";

/** Texto provisional basado solo en datos confirmados por el cliente (ver docs/05-datos/negocio.md). */
export function About({ productCount }: { productCount: number }) {
  return (
    <section id="nosotros" aria-labelledby="nosotros-titulo" className="mx-auto max-w-6xl px-4 pt-20 md:pt-28">
      <div className="grid grid-cols-1 items-center gap-10 rounded-[2rem] bg-kraft p-6 sm:p-10 md:grid-cols-[0.8fr_1.2fr] md:gap-14 md:p-14">
        <Image
          src="/brand/logo-512.webp"
          alt="Logo de Indepan SAS"
          width={420}
          height={420}
          sizes="(min-width: 768px) 30vw, 60vw"
          className="mx-auto h-auto w-full max-w-72 md:max-w-none"
        />
        <div>
          <h2 id="nosotros-titulo" className="font-display text-4xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl">
            Somos el aliado del oficio de hornear
          </h2>
          <div className="mt-5 max-w-prose space-y-4 text-lg leading-relaxed text-pretty">
            <p>
              En {site.shortName} vendemos insumos de panadería y repostería para quienes viven del horno. {site.foundedNote}, y hoy
              reunimos más de {Math.floor(productCount / 10) * 10} referencias en un solo lugar.
            </p>
            <p>
              Encuentras harinas, levaduras, margarinas, rellenos, frutos secos, moldes, capacillos, empaques y decoración. Armas tu
              pedido en esta página, lo envías por WhatsApp y nuestro equipo te confirma precios y disponibilidad.
            </p>
            <p>
              Puedes recoger en el local de la {site.address.street}, sector {site.address.sector}, o pedir a domicilio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
