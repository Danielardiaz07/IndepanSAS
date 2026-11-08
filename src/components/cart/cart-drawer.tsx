"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Copy, MessageCircle, ShoppingBasket, Store, Trash2, Truck, X } from "lucide-react";
import { site } from "@/config/site";
import { useCart } from "@/components/cart/cart-provider";
import { QuantityStepper } from "@/components/catalog/quantity-stepper";
import { formatCOP, formatUnitPrice } from "@/lib/format";
import { trackEvent } from "@/lib/analytics";
import {
  LIMITS,
  LONG_MESSAGE_CHARS,
  buildOrderMessage,
  buildWhatsappUrl,
  validateOrder,
  type DeliveryMode,
  type OrderForm,
} from "@/lib/whatsapp";

const initialForm: OrderForm = { customerName: "", delivery: "pickup", address: "", payment: "", notes: "" };
const FORM_KEY = "indepan:order-form:v1";

/** Contenedor modal nativo (<dialog>): foco atrapado, Escape y fondo inerte sin código extra. */
export function CartDrawer() {
  const { isOpen, close } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const uid = useId();

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (isOpen && !d.open) d.showModal();
    if (!isOpen && d.open) d.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="drawer fixed inset-x-0 bottom-0 top-auto h-[92dvh] w-full rounded-t-3xl md:inset-y-0 md:left-auto md:right-0 md:h-dvh md:w-[28rem] md:rounded-none md:rounded-l-3xl"
      aria-labelledby={`${uid}-title`}
      onClose={close}
      onClick={(e) => e.target === dialogRef.current && close()}
    >
      {/* El panel solo existe mientras está abierto: al cerrar se reinicia el estado transitorio */}
      {isOpen ? <CartPanel uid={uid} close={close} /> : null}
    </dialog>
  );
}

function readSavedForm(): OrderForm {
  try {
    const raw = localStorage.getItem(FORM_KEY);
    if (raw) return { ...initialForm, ...(JSON.parse(raw) as Partial<OrderForm>), notes: "" };
  } catch {
    /* ignorar */
  }
  return initialForm;
}

function CartPanel({ uid, close }: { uid: string; close: () => void }) {
  const { lines, items, total, setQty, remove, clear, ready } = useCart();
  // Recordar nombre, entrega y pago para el próximo pedido (solo corre en el cliente: el panel se monta al abrir)
  const [form, setForm] = useState<OrderForm>(readSavedForm);
  const [showErrors, setShowErrors] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(FORM_KEY, JSON.stringify({ ...form, notes: "" }));
    } catch {
      /* ignorar */
    }
  }, [form]);

  const resolved = useMemo(() => lines ?? [], [lines]);
  const errors = useMemo(() => validateOrder(form, resolved), [form, resolved]);
  const message = useMemo(() => (resolved.length ? buildOrderMessage(resolved, form) : ""), [resolved, form]);
  const url = useMemo(() => (message ? buildWhatsappUrl(message) : "#"), [message]);
  const loading = ready && items.length > 0 && lines === null;
  const empty = !loading && resolved.length === 0;
  const hasErrors = Object.keys(errors).length > 0;

  const set = <K extends keyof OrderForm>(key: K, value: OrderForm[K]) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <>
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id={`${uid}-title`} className="font-display text-2xl font-extrabold tracking-tight">
            Mi pedido
          </h2>
          <button
            type="button"
            onClick={close}
            className="grid size-11 place-items-center rounded-full hover:bg-sunken"
            aria-label="Cerrar mi pedido"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-4">
          {loading ? (
            <p className="py-10 text-center text-muted">Cargando tu pedido…</p>
          ) : empty ? (
            <div className="grid place-items-center gap-4 py-16 text-center">
              <span className="grid size-20 place-items-center rounded-full bg-sun">
                <ShoppingBasket className="size-9" aria-hidden="true" />
              </span>
              <p className="font-display text-xl font-bold">Tu pedido está vacío</p>
              <p className="max-w-64 text-sm text-muted">Agrega los insumos que necesitas y envíanos el pedido por WhatsApp.</p>
              <Link
                href="/productos"
                onClick={close}
                className="mt-2 flex h-12 items-center rounded-full bg-btn px-6 font-bold text-on-btn"
              >
                Ver productos
              </Link>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-line">
                {resolved.map((l) => (
                  <li key={l.product.c} className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-display font-bold leading-snug">{l.product.n}</p>
                        <p className="tabular mt-0.5 text-sm text-muted">{formatUnitPrice(l.unitPrice, l.unit)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(l.product.c)}
                        className="grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-sunken hover:text-ink"
                        aria-label={`Quitar ${l.product.n}`}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="w-40">
                        <QuantityStepper
                          product={l.product}
                          value={l.qty}
                          onChange={(q) => setQty(l.product, q)}
                          compact
                        />
                      </div>
                      <p className="tabular font-display text-lg font-extrabold">{formatCOP(l.total)}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-2 flex items-baseline justify-between border-t-2 border-ink pt-4">
                <p className="font-display text-lg font-bold">Total estimado</p>
                <p className="tabular font-display text-3xl font-extrabold">{formatCOP(total)}</p>
              </div>
              <p className="mt-1 text-xs text-muted">
                Precios referenciales, corte del {site.priceCutoff.label}. Te confirmamos el valor final y la disponibilidad.
              </p>

              <form className="mt-7 space-y-5" onSubmit={(e) => e.preventDefault()} noValidate>
                <Field id={`${uid}-name`} label="Tu nombre" error={showErrors ? errors.customerName : undefined}>
                  <input
                    id={`${uid}-name`}
                    value={form.customerName}
                    onChange={(e) => set("customerName", e.target.value)}
                    maxLength={LIMITS.name}
                    autoComplete="name"
                    aria-invalid={showErrors && Boolean(errors.customerName)}
                    className="h-12 w-full rounded-xl border border-line bg-surface px-4"
                  />
                </Field>

                <fieldset>
                  <legend className="mb-2 text-sm font-bold">¿Cómo lo recibes?</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        { v: "pickup", label: "Recojo en tienda", icon: Store },
                        { v: "delivery", label: "A domicilio", icon: Truck },
                      ] as { v: DeliveryMode; label: string; icon: typeof Store }[]
                    ).map(({ v, label, icon: Icon }) => (
                      <label
                        key={v}
                        className={`flex h-14 cursor-pointer items-center gap-2 rounded-xl border-2 px-3 text-sm font-bold has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[color:var(--focus)] ${
                          form.delivery === v ? "border-ink bg-sun" : "border-line bg-surface"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`${uid}-delivery`}
                          value={v}
                          checked={form.delivery === v}
                          onChange={() => set("delivery", v)}
                          className="sr-only"
                        />
                        <Icon className="size-5 shrink-0" aria-hidden="true" />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {form.delivery === "delivery" ? (
                  <Field id={`${uid}-addr`} label="Dirección de entrega" error={showErrors ? errors.address : undefined}>
                    <input
                      id={`${uid}-addr`}
                      value={form.address}
                      onChange={(e) => set("address", e.target.value)}
                      maxLength={LIMITS.address}
                      autoComplete="street-address"
                      placeholder="Calle, número, barrio y una referencia"
                      aria-invalid={showErrors && Boolean(errors.address)}
                      className="h-12 w-full rounded-xl border border-line bg-surface px-4"
                    />
                  </Field>
                ) : (
                  <p className="rounded-xl bg-sunken px-4 py-3 text-sm">
                    Recoges en <strong>{site.address.street}</strong>, {site.address.sector}. Atendemos de lunes a viernes
                    hasta las 4:00 p. m. y sábados hasta las 3:00 p. m.
                  </p>
                )}

                <Field id={`${uid}-pay`} label="¿Cómo prefieres pagar?" optional>
                  <select
                    id={`${uid}-pay`}
                    value={form.payment}
                    onChange={(e) => set("payment", e.target.value)}
                    className="h-12 w-full rounded-xl border border-line bg-surface px-3"
                  >
                    <option value="">Lo coordinamos por WhatsApp</option>
                    {site.payments.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id={`${uid}-notes`} label="Notas para tu pedido" optional>
                  <textarea
                    id={`${uid}-notes`}
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    maxLength={LIMITS.notes}
                    rows={2}
                    placeholder="Marca preferida, hora de recogida, etc."
                    className="w-full resize-none rounded-xl border border-line bg-surface px-4 py-3"
                  />
                </Field>
              </form>

              {message.length > LONG_MESSAGE_CHARS ? (
                <p className="mt-4 rounded-xl bg-blush px-4 py-3 text-sm" role="alert">
                  Tu pedido es muy largo para un solo mensaje. Envíalo en dos partes para que no se corte.
                </p>
              ) : null}
            </>
          )}
        </div>

        {!empty && !loading ? (
          <footer className="border-t border-line bg-ground px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
            {sent ? (
              <div className="space-y-3" role="status">
                <p className="text-sm">
                  <strong>¿Se abrió WhatsApp?</strong> Envía el mensaje desde allí. Si no se abrió, copia el pedido y pégalo en el chat.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(message);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1800);
                      } catch {
                        /* sin permiso de portapapeles */
                      }
                    }}
                    className="flex h-12 items-center justify-center gap-2 rounded-full border-2 border-ink text-sm font-bold"
                  >
                    <Copy className="size-4" aria-hidden="true" />
                    {copied ? "Copiado" : "Copiar pedido"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clear();
                      setForm((f) => ({ ...f, notes: "" }));
                      setSent(false);
                      close();
                    }}
                    className="h-12 rounded-full bg-btn text-sm font-bold text-on-btn"
                  >
                    Vaciar y terminar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (hasErrors) {
                      e.preventDefault();
                      setShowErrors(true);
                      return;
                    }
                    trackEvent("send_order_whatsapp", {
                      value: total,
                      currency: site.currency.code,
                      items: resolved.length,
                      delivery: form.delivery,
                    });
                    setSent(true);
                  }}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-wa px-4 text-base font-extrabold text-[#0b2e17] transition-transform active:scale-[0.98]"
                >
                  <MessageCircle className="size-5" aria-hidden="true" />
                  Enviar pedido por WhatsApp
                </a>
                <div className="mt-2 flex items-center justify-between text-xs text-muted">
                  <span>{resolved.length} {resolved.length === 1 ? "producto" : "productos"}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("¿Vaciar todo el pedido?")) clear();
                    }}
                    className="font-bold underline underline-offset-4"
                  >
                    Vaciar pedido
                  </button>
                </div>
              </>
            )}
          </footer>
        ) : null}
      </div>
    </>
  );
}

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold">
        {label}
        {optional ? <span className="font-medium text-muted"> (opcional)</span> : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-sm font-semibold text-red" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
