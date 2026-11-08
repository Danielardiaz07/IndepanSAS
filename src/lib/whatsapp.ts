import { site } from "@/config/site";
import type { CartLine } from "@/lib/cart";
import { cartTotal } from "@/lib/cart";
import { formatCOP, formatQty, formatUnitPrice } from "@/lib/format";

export type DeliveryMode = "pickup" | "delivery";

export interface OrderForm {
  customerName: string;
  delivery: DeliveryMode;
  address: string;
  payment: string;
  notes: string;
}

export const LIMITS = { name: 60, address: 160, notes: 300 } as const;

/** Limpia entradas del usuario: sin caracteres de control, espacios colapsados, longitud acotada. */
export function sanitize(input: string, max: number): string {
  return input
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\*/g, "") // evita romper el formato de negrita de WhatsApp
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export interface FormErrors {
  customerName?: string;
  address?: string;
  cart?: string;
}

export function validateOrder(form: OrderForm, lines: CartLine[]): FormErrors {
  const errors: FormErrors = {};
  if (lines.length === 0) errors.cart = "Agrega al menos un producto.";
  if (sanitize(form.customerName, LIMITS.name).length < 2) errors.customerName = "Escribe tu nombre.";
  if (form.delivery === "delivery" && sanitize(form.address, LIMITS.address).length < 5) {
    errors.address = "Escribe la dirección de entrega.";
  }
  return errors;
}

function lineText(line: CartLine, index: number): string {
  const { product, qty, unit, unitPrice, total } = line;
  const qtyText = formatQty(qty, unit);
  const price = formatUnitPrice(unitPrice, unit).replace(/\s+/g, "");
  return `${index + 1}. ${product.n} — ${qtyText} × ${price} = ${formatCOP(total).replace(/\s+/g, "")}`;
}

/** Mensaje estructurado según docs/05-datos/mensaje-whatsapp.md. */
export function buildOrderMessage(lines: CartLine[], form: OrderForm): string {
  const out: string[] = [];
  out.push(`*Nuevo pedido — ${site.name}*`, "");
  out.push(`*Cliente:* ${sanitize(form.customerName, LIMITS.name)}`);
  out.push(`*Entrega:* ${form.delivery === "delivery" ? "Domicilio" : "Recogida en tienda"}`);
  if (form.delivery === "delivery") out.push(`*Dirección:* ${sanitize(form.address, LIMITS.address)}`);
  const payment = sanitize(form.payment, 40);
  if (payment) out.push(`*Pago preferido:* ${payment}`);
  out.push("", "*Productos:*");
  lines.forEach((l, i) => out.push(lineText(l, i)));
  out.push("", `*Total:* ${formatCOP(cartTotal(lines)).replace(/\s+/g, "")}`);
  const notes = sanitize(form.notes, LIMITS.notes);
  if (notes) out.push("", `*Notas:* ${notes}`);
  out.push("", "Total referencial; confírmenme precios y disponibilidad. ¡Gracias!");
  return out.join("\n");
}

export function buildWhatsappUrl(message: string, number: string = site.whatsapp.number): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Enlace de contacto directo (sin pedido). */
export function contactUrl(text: string = site.whatsapp.greeting): string {
  return buildWhatsappUrl(text);
}

/** Enlace para preguntar el precio de un producto. */
export function priceInquiryUrl(productName: string): string {
  return buildWhatsappUrl(`Hola Indepan, ¿me confirman el precio de: ${productName}?`);
}

/** Aviso cuando el mensaje es muy largo para un enlace confiable. */
export const LONG_MESSAGE_CHARS = 3500;
