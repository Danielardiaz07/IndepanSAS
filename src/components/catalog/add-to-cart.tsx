"use client";

import { useEffect, useRef, useState } from "react";
import { Check, MessageCircle, Plus } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { QuantityStepper } from "@/components/catalog/quantity-stepper";
import { isPurchasable } from "@/lib/cart";
import { priceInquiryUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import type { CompactProduct } from "@/types/catalog";

export function AddToCart({ product }: { product: CompactProduct }) {
  const { add } = useCart();
  const [qty, setQty] = useState(product.mn);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  if (product.p === null) {
    return (
      <a
        href={priceInquiryUrl(product.n)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("price_inquiry", { item_id: product.c })}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-ink px-4 text-sm font-bold transition-colors hover:bg-sunken"
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        Consultar precio
      </a>
    );
  }

  if (!isPurchasable(product)) {
    return (
      <button
        type="button"
        disabled
        className="h-11 w-full rounded-full border border-line bg-sunken px-4 text-sm font-bold text-muted"
      >
        Agotado
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <QuantityStepper product={product} value={qty} onChange={setQty} />
      <button
        type="button"
        onClick={() => {
          add(product, qty);
          setAdded(true);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setAdded(false), 1400);
        }}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand px-4 text-sm font-extrabold text-on-brand transition-transform hover:brightness-95 active:scale-[0.97]"
      >
        {added ? (
          <>
            <Check className="size-4" aria-hidden="true" /> Agregado
          </>
        ) : (
          <>
            <Plus className="size-4" aria-hidden="true" /> Agregar
          </>
        )}
      </button>
      <span className="sr-only" role="status">
        {added ? `${product.n} agregado al pedido` : ""}
      </span>
    </div>
  );
}
