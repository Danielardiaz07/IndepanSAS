"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { site } from "@/config/site";
import { useCart } from "@/components/cart/cart-provider";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const nav = [
  { href: "/productos", label: "Productos", show: "hidden sm:block" },
  { href: "/#nosotros", label: "Nosotros", show: "hidden md:block" },
  { href: "/#ubicacion", label: "Ubicación", show: "hidden md:block" },
];

export function Header() {
  const { count, open, addedTick, ready } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ground/92 backdrop-blur-md supports-[backdrop-filter]:bg-ground/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${site.name}, inicio`}>
          <Image
            src="/brand/logo-256.webp"
            alt=""
            width={44}
            height={44}
            priority
            className="size-11 rounded-full"
          />
          <span className="font-display text-xl font-extrabold leading-none tracking-tight">
            Indepan<span className="hidden text-accent sm:inline"> SAS</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="ml-auto flex items-center gap-1 text-sm font-semibold sm:gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-2.5 py-2 transition-colors hover:bg-sunken ${item.show}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <button
            type="button"
            onClick={open}
            className="relative flex h-11 items-center gap-2 rounded-full bg-btn px-4 text-sm font-bold text-on-btn transition-transform active:scale-95"
            aria-label={`Abrir mi pedido${ready && count > 0 ? `, ${count} ${count === 1 ? "producto" : "productos"}` : ""}`}
          >
            <ShoppingBasket className="size-5" aria-hidden="true" />
            <span className="hidden md:inline">Mi pedido</span>
            {ready && count > 0 ? (
              <span
                key={addedTick}
                className="bump tabular grid min-w-6 place-items-center rounded-full bg-brand px-1.5 text-xs font-extrabold leading-6 text-on-brand"
              >
                {count}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}
