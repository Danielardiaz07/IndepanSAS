"use client";

import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { snapQty } from "@/lib/cart";
import { formatQty } from "@/lib/format";
import type { CompactProduct } from "@/types/catalog";

interface Props {
  product: Pick<CompactProduct, "n" | "u" | "mn" | "st">;
  value: number;
  onChange: (qty: number) => void;
  compact?: boolean;
}

const unitSuffix = { un: "", kg: "kg", g: "g" } as const;

function toInput(n: number): string {
  return String(n).replace(".", ",");
}

/** Selector de cantidad que respeta el mínimo y el paso de cada producto (RF-13). */
export function QuantityStepper({ product, value, onChange, compact }: Props) {
  const id = useId();
  const [text, setText] = useState(toInput(value));
  const [prevValue, setPrevValue] = useState(value);
  // Si el valor cambia desde fuera (botones, otra pestaña), el campo se sincroniza al renderizar
  if (value !== prevValue) {
    setPrevValue(value);
    setText(toInput(value));
  }

  const commit = (raw: string) => {
    const parsed = parseFloat(raw.replace(",", "."));
    const next = snapQty(product, Number.isFinite(parsed) ? parsed : product.mn);
    setText(toInput(next));
    if (next !== value) onChange(next);
  };

  const size = compact ? "size-9" : "size-11";
  const suffix = unitSuffix[product.u];

  return (
    <div className="flex items-center justify-between gap-1 rounded-full border border-line bg-surface p-0.5">
      <button
        type="button"
        onClick={() => onChange(snapQty(product, value - product.st))}
        disabled={value <= product.mn}
        className={`${size} grid shrink-0 place-items-center rounded-full transition-colors hover:bg-sunken disabled:opacity-35`}
        aria-label={`Disminuir cantidad de ${product.n}`}
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <label htmlFor={id} className="sr-only">
        Cantidad de {product.n}{suffix ? ` en ${suffix}` : ""}
      </label>
      <div className="flex min-w-0 items-baseline justify-center gap-1">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.currentTarget.blur(), undefined)}
          className="tabular w-[3.2ch] min-w-0 bg-transparent text-center text-base font-bold outline-offset-4"
          style={{ width: `${Math.max(text.length, 2) + 0.6}ch` }}
        />
        {suffix ? <span className="text-xs font-semibold text-muted">{suffix}</span> : null}
      </div>
      <button
        type="button"
        onClick={() => onChange(snapQty(product, value + product.st))}
        className={`${size} grid shrink-0 place-items-center rounded-full transition-colors hover:bg-sunken`}
        aria-label={`Aumentar cantidad de ${product.n}`}
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
      <span className="sr-only" aria-live="polite">
        {formatQty(value, product.u)}
      </span>
    </div>
  );
}
