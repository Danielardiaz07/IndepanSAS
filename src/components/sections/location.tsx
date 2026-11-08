import { Banknote, MapPin, MessageCircle, Navigation, QrCode, Landmark } from "lucide-react";
import { site } from "@/config/site";
import { OpenNow } from "@/components/ui/open-now";
import { contactUrl } from "@/lib/whatsapp";

const paymentIcons = { Efectivo: Banknote, "Transferencia bancaria": Landmark, "Código QR": QrCode } as const;

export function Location() {
  return (
    <section id="ubicacion" aria-labelledby="ubicacion-titulo" className="mx-auto max-w-6xl px-4 pt-14 md:pt-28">
      <h2 id="ubicacion-titulo" className="font-display text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl">
        Visítanos en el Mercado de Valledupar
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-8 sm:mt-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-8">
          <div>
            <p className="flex items-start gap-3 font-display text-2xl font-bold leading-snug">
              <MapPin className="mt-1 size-6 shrink-0 text-accent" aria-hidden="true" />
              <span>
                {site.address.street}
                <span className="block text-base font-medium text-muted">
                  Sector {site.address.sector} · {site.address.city}, {site.address.region}
                </span>
              </span>
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={site.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-btn px-5 font-bold text-on-btn"
              >
                <Navigation className="size-5" aria-hidden="true" />
                Cómo llegar
              </a>
              <a
                href={contactUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-ink px-5 font-bold transition-colors hover:bg-sunken"
              >
                <MessageCircle className="size-5" aria-hidden="true" />
                {site.whatsapp.display}
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-xl font-bold">Horario de atención</h3>
            <dl className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface">
              {site.hours.map((h) => (
                <div key={h.label} className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="font-semibold">{h.label}</dt>
                  <dd className={`tabular text-right ${h.opens ? "" : "text-muted"}`}>{h.time}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3">
              <OpenNow />
            </div>
          </div>

          <div>
            <h3 className="font-display text-xl font-bold">Medios de pago</h3>
            <ul className="mt-3 grid grid-cols-3 gap-2 sm:max-w-md">
              {site.payments.map((p) => {
                const Icon = paymentIcons[p as keyof typeof paymentIcons] ?? Banknote;
                return (
                  <li
                    key={p}
                    className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl bg-sun px-2 py-3 text-center text-sm font-bold leading-tight"
                  >
                    <Icon className="size-7" aria-hidden="true" />
                    {p}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-line bg-sunken shadow-card">
          <iframe
            title={`Mapa de ${site.name}: ${site.address.full}`}
            src={site.address.mapsEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block aspect-[4/3] w-full min-h-72 border-0 lg:h-full"
          />
        </div>
      </div>
    </section>
  );
}
