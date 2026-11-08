"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, LayoutGrid, MapPin, MessageCircle, ShoppingBasket } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { contactUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

const base =
  "relative flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-0.5 text-[0.8125rem] font-bold leading-tight transition-colors";

/**
 * Navegación inferior para móvil: las acciones principales quedan al alcance del pulgar
 * (inicio, productos, pedido, ubicación y WhatsApp). En pantallas grandes se usa el encabezado.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { count, open, addedTick, ready } = useCart();
  const onHome = pathname === "/";
  const onProducts = pathname.startsWith("/productos");

  const item = (active: boolean) => `${base} ${active ? "text-accent" : "text-ink"}`;

  return (
    <nav
      aria-label="Navegación principal móvil"
      className="@container fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ground pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="mx-auto flex max-w-xl items-stretch">
        <li className="flex min-w-0 flex-1">
          <Link href="/" className={item(onHome)} aria-current={onHome ? "page" : undefined}>
            <House className="size-6" aria-hidden="true" />
            <span className="max-w-full truncate">Inicio</span>
          </Link>
        </li>
        <li className="flex min-w-0 flex-1">
          <Link href="/productos" className={item(onProducts)} aria-current={onProducts ? "page" : undefined}>
            <LayoutGrid className="size-6" aria-hidden="true" />
            <span className="max-w-full truncate">Productos</span>
          </Link>
        </li>
        <li className="flex min-w-0 flex-1">
          <button
            type="button"
            onClick={open}
            className={item(false)}
            aria-label={`Mi pedido${ready && count > 0 ? `, ${count} ${count === 1 ? "producto" : "productos"}` : ""}`}
          >
            <span className="relative">
              <ShoppingBasket className="size-6" aria-hidden="true" />
              {ready && count > 0 ? (
                <span
                  key={addedTick}
                  className="bump tabular absolute -right-3 -top-2 grid min-w-5 place-items-center rounded-full bg-brand px-1 text-xs font-extrabold leading-5 text-on-brand"
                  aria-hidden="true"
                >
                  {count}
                </span>
              ) : null}
            </span>
            <span className="max-w-full truncate">Pedido</span>
          </button>
        </li>
        {/* Con letra grande o pantalla angosta no caben 5 etiquetas: se oculta este ítem (la medida está en rem, escala con la letra) */}
        <li className="flex min-w-0 flex-1 @max-[21.5rem]:hidden">
          <Link href="/#ubicacion" className={item(false)}>
            <MapPin className="size-6" aria-hidden="true" />
            <span className="max-w-full truncate">Ubicación</span>
          </Link>
        </li>
        <li className="flex min-w-0 flex-1">
          <a
            href={contactUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("contact_whatsapp", { source: "bottom_nav" })}
            className={item(false)}
          >
            <MessageCircle className="size-6" aria-hidden="true" />
            <span className="max-w-full truncate">WhatsApp</span>
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
