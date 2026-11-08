import { describe, expect, it } from "vitest";
import {
  addItem,
  cartTotal,
  parseStoredCart,
  removeItem,
  resolveCart,
  setQty,
  snapQty,
  type CartItem,
} from "./cart";
import { formatCOP, formatQty, formatUnitPrice } from "./format";
import { buildOrderMessage, buildWhatsappUrl, sanitize, validateOrder, type OrderForm } from "./whatsapp";
import type { CompactProduct } from "@/types/catalog";

const harina: CompactProduct = {
  c: "1", s: "harina-1", n: "Harina Insuperable x 50 kg", d: "harinas-premezclas", sc: "Harinas",
  b: null, p: 180000, u: "un", z: "50 kg", mn: 1, st: 1, a: true, i: null,
};
const fondant: CompactProduct = {
  c: "2", s: "fondant-2", n: "Fondant Rich x 1 kg", d: "rellenos-coberturas", sc: "Cobertura",
  b: null, p: 26000, u: "kg", z: "1 kg", mn: 0.5, st: 0.5, a: true, i: null,
};
const almendra: CompactProduct = {
  c: "3", s: "almendra-3", n: "Almendra Blanca a Granel", d: "frutas-frutos-secos", sc: "Almendras",
  b: null, p: 47, u: "g", z: null, mn: 100, st: 50, a: true, i: null,
};
const sinPrecio: CompactProduct = { ...harina, c: "4", p: null };
const catalog = new Map([harina, fondant, almendra, sinPrecio].map((p) => [p.c, p]));

describe("format", () => {
  it("formatea pesos colombianos sin decimales", () => {
    expect(formatCOP(353700)).toBe("$ 353.700");
    expect(formatCOP(10300)).toBe("$ 10.300");
  });
  it("formatea precio por unidad de venta", () => {
    expect(formatUnitPrice(47, "g")).toBe("$ 47 / g");
    expect(formatUnitPrice(67.35, "g")).toBe("$ 67,35 / g");
    expect(formatUnitPrice(26000, "kg")).toBe("$ 26.000 / kg");
    expect(formatUnitPrice(4500, "un")).toBe("$ 4.500");
  });
  it("formatea cantidades", () => {
    expect(formatQty(1.5, "kg")).toBe("1,5 kg");
    expect(formatQty(250, "g")).toBe("250 g");
    expect(formatQty(1500, "g")).toBe("1,5 kg");
    expect(formatQty(3, "un")).toBe("3");
  });
});

describe("snapQty", () => {
  it("respeta mínimo y paso", () => {
    expect(snapQty(fondant, 0.2)).toBe(0.5);
    expect(snapQty(fondant, 1.3)).toBe(1.5);
    expect(snapQty(almendra, 120)).toBe(100);
    expect(snapQty(almendra, 130)).toBe(150);
    expect(snapQty(harina, 2.4)).toBe(2);
  });
  it("tolera valores inválidos", () => {
    expect(snapQty(harina, NaN)).toBe(1);
    expect(snapQty(harina, -5)).toBe(1);
  });
});

describe("carrito", () => {
  it("suma cantidades del mismo producto en lugar de duplicar", () => {
    let items: CartItem[] = [];
    items = addItem(items, harina, 1);
    items = addItem(items, harina, 2);
    expect(items).toEqual([{ code: "1", qty: 3 }]);
  });
  it("no agrega productos sin precio", () => {
    expect(addItem([], sinPrecio, 1)).toEqual([]);
  });
  it("edita y elimina", () => {
    let items = addItem([], fondant, 1);
    items = setQty(items, fondant, 2.5);
    expect(items[0].qty).toBe(2.5);
    expect(removeItem(items, "2")).toEqual([]);
  });
  it("calcula totales en COP enteros, incluido granel por gramo", () => {
    let items: CartItem[] = [];
    items = addItem(items, harina, 2); // 360.000
    items = addItem(items, fondant, 1.5); // 39.000
    items = addItem(items, almendra, 250); // 11.750
    const lines = resolveCart(items, catalog);
    expect(cartTotal(lines)).toBe(360000 + 39000 + 11750);
  });
  it("descarta productos que ya no existen al restaurar (RF-27)", () => {
    const lines = resolveCart([{ code: "999", qty: 1 }, { code: "1", qty: 1 }], catalog);
    expect(lines.map((l) => l.product.c)).toEqual(["1"]);
  });
  it("ignora datos guardados malformados", () => {
    expect(parseStoredCart("no es json")).toEqual([]);
    expect(parseStoredCart(JSON.stringify([{ code: "1", qty: 2 }, { code: 5 }, { code: "1", qty: 3 }, null]))).toEqual([
      { code: "1", qty: 2 },
    ]);
  });
});

describe("mensaje de WhatsApp", () => {
  const form: OrderForm = {
    customerName: "  Marta *López* ",
    delivery: "delivery",
    address: "Cra 9 #12-30, Valledupar",
    payment: "Transferencia bancaria",
    notes: "Entregar por la mañana.",
  };
  const lines = resolveCart(
    [{ code: "1", qty: 2 }, { code: "2", qty: 1.5 }, { code: "3", qty: 250 }],
    catalog,
  );

  it("sigue el formato definido", () => {
    const msg = buildOrderMessage(lines, form);
    expect(msg).toContain("*Nuevo pedido — Indepan SAS*");
    expect(msg).toContain("*Cliente:* Marta López");
    expect(msg).toContain("*Entrega:* Domicilio");
    expect(msg).toContain("*Dirección:* Cra 9 #12-30, Valledupar");
    expect(msg).toContain("1. Harina Insuperable x 50 kg — 2 × $180.000 = $360.000");
    expect(msg).toContain("2. Fondant Rich x 1 kg — 1,5 kg × $26.000/kg = $39.000");
    expect(msg).toContain("3. Almendra Blanca a Granel — 250 g × $47/g = $11.750");
    expect(msg).toContain("*Total:* $410.750");
    expect(msg).toContain("*Notas:* Entregar por la mañana.");
  });
  it("omite dirección en recogida y líneas opcionales vacías", () => {
    const msg = buildOrderMessage(lines, { ...form, delivery: "pickup", payment: "", notes: "" });
    expect(msg).toContain("*Entrega:* Recogida en tienda");
    expect(msg).not.toContain("*Dirección:*");
    expect(msg).not.toContain("*Pago preferido:*");
    expect(msg).not.toContain("*Notas:*");
  });
  it("codifica el enlace correctamente", () => {
    const url = buildWhatsappUrl("Hola & adiós\n#1");
    expect(url).toBe("https://wa.me/573006739631?text=Hola%20%26%20adi%C3%B3s%0A%231");
  });
});

describe("validación y limpieza", () => {
  const base: OrderForm = { customerName: "Ana", delivery: "pickup", address: "", payment: "", notes: "" };
  const lines = resolveCart([{ code: "1", qty: 1 }], catalog);
  it("exige carrito, nombre y dirección si es domicilio", () => {
    expect(validateOrder(base, lines)).toEqual({});
    expect(validateOrder({ ...base, customerName: " " }, lines).customerName).toBeTruthy();
    expect(validateOrder({ ...base, delivery: "delivery" }, lines).address).toBeTruthy();
    expect(validateOrder(base, []).cart).toBeTruthy();
  });
  it("limpia y acota texto", () => {
    expect(sanitize("a\u0000b\n\nc", 10)).toBe("a b c");
    expect(sanitize("x".repeat(500), 20).length).toBe(20);
  });
});
