import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { getDepartments } from "@/lib/catalog";
import { departmentPath } from "@/lib/seo";
import { contactUrl } from "@/lib/whatsapp";
import { FacebookIcon, InstagramIcon } from "@/components/ui/icons";

export function Footer() {
  const departments = getDepartments();
  return (
    <footer className="mt-24 bg-brown text-on-brown">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/brand/logo-256.webp" alt="" width={56} height={56} className="size-14 rounded-full" />
            <p className="font-display text-2xl font-extrabold tracking-tight">{site.name}</p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed opacity-80">
            {site.tagline} en {site.address.city}, {site.address.region}. {site.foundedNote}.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              aria-label="Instagram de Indepan"
            >
              <InstagramIcon className="size-5" />
            </a>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              aria-label="Facebook de Indepan"
            >
              <FacebookIcon className="size-5" />
            </a>
          </div>
        </div>

        <nav aria-label="Departamentos">
          <p className="font-display text-lg font-bold">Productos</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {departments.map((d) => (
              <li key={d.slug}>
                <Link href={departmentPath(d.slug)} className="opacity-80 transition-opacity hover:opacity-100">
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-display text-lg font-bold">Visítanos</p>
          <address className="mt-3 space-y-2 text-sm not-italic opacity-90">
            <p>{site.address.full}</p>
            <p>
              <a href={contactUrl()} target="_blank" rel="noopener noreferrer" className="underline">
                WhatsApp {site.whatsapp.display}
              </a>
            </p>
            {site.hours.map((h) => (
              <p key={h.label}>
                <span className="font-semibold">{h.label}:</span> {h.time}
              </p>
            ))}
          </address>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs opacity-70">
          © {new Date().getFullYear()} {site.name}. Los precios son referenciales (corte del {site.priceCutoff.label}) y la
          tienda confirma el valor final y la disponibilidad.
        </p>
      </div>
    </footer>
  );
}
