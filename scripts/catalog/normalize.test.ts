import { describe, expect, it } from "vitest";
import { cleanBrand, cleanName, inferSale, parseSize, slugify } from "./normalize";

describe("cleanName", () => {
  it("pasa a título y normaliza unidades", () => {
    expect(cleanName("AREQUIPE HIKI * 135 GR")).toBe("Arequipe Hiki x 135 g");
    expect(cleanName("ALMENDRA NATURAL CAJA  X 10 KG")).toBe("Almendra Natural Caja x 10 kg");
    expect(cleanName("AZUCAR MICROPUL INCOLSA  X 1KG")).toBe("Azúcar Micropul Incolsa x 1 kg");
    expect(cleanName("PALO BLANCO No 10 X KILO")).toBe("Palo Blanco No 10 x kg");
    expect(cleanName("GLASSE FRESA X 4 K PRODISABOR")).toBe("Glasse Fresa x 4 kg Prodisabor");
    expect(cleanName("POLVO DORADO X LIBRA******")).toBe("Polvo Dorado x Libra");
  });

  it("restaura tildes conocidas y conserva la ñ", () => {
    expect(cleanName("AREQUIPE DOÑA ANA")).toBe("Arequipe Doña Ana");
    expect(cleanName("CAJA PAN NAVIDEÑO 44 CM")).toBe("Caja Pan Navideño 44 CM");
  });

  it("mantiene siglas y códigos", () => {
    expect(cleanName("MOLDE REDONDO FM 2 LB (33 cm)")).toBe("Molde Redondo FM 2 lb (33 CM)");
    expect(cleanName("RODILLO ACRILICO FLORES COLR3-61")).toBe("Rodillo Acrílico Flores COLR3-61");
  });

  it("deja minúsculas las preposiciones salvo al inicio", () => {
    expect(cleanName("COBERTURA DE CHOCOLATE PARA PONQUE")).toBe("Cobertura de Chocolate para Ponqué");
  });
});

describe("cleanBrand", () => {
  it("toma la marca después del guion", () => {
    expect(cleanBrand("JUANALU - EL PUMA")).toBe("El Puma");
    expect(cleanBrand("FLEISCHMAN - INCOLSA")).toBe("Incolsa");
    expect(cleanBrand("MEICA S.A")).toBe("Meica S.A.");
  });
  it("descarta VARIOS y vacíos", () => {
    expect(cleanBrand("VARIOS")).toBeNull();
    expect(cleanBrand("")).toBeNull();
    expect(cleanBrand(undefined)).toBeNull();
  });
});

describe("parseSize", () => {
  it("prefiere la medida después de la X", () => {
    expect(parseSize("Bolsa Pan Francés x 45 un")).toMatchObject({ text: "45 un", value: 45, unit: "un" });
    expect(parseSize("Almendra Natural Caja x 22.7 kg")).toMatchObject({ value: 22.7, unit: "kg" });
  });
  it("devuelve null sin medida", () => {
    expect(parseSize("Tijera de Cocina")).toBeNull();
  });
});

describe("inferSale", () => {
  it("granel se vende por gramos", () => {
    expect(inferSale("Almendra Blanca a Granel", 300)).toMatchObject({ unit: "g", step: 50, minQty: 100 });
  });
  it("1 kg con existencias fraccionadas se vende por peso", () => {
    expect(inferSale("Fondant Rich x 1 kg", 0.695)).toMatchObject({ unit: "kg", step: 0.5 });
  });
  it("1 kg con existencias enteras es un empaque", () => {
    expect(inferSale("Azúcar Micropul Incolsa x 1 kg", 63)).toMatchObject({ unit: "un", step: 1 });
  });
  it("por defecto es unidad", () => {
    expect(inferSale("Tijera de Cocina", 5)).toMatchObject({ unit: "un", minQty: 1, step: 1 });
  });
});

describe("slugify", () => {
  it("genera slugs limpios", () => {
    expect(slugify("Azúcar Micropul x 1 kg")).toBe("azucar-micropul-x-1-kg");
  });
  it("respeta la longitud máxima", () => {
    expect(slugify("a".repeat(30) + " " + "b".repeat(80), 50).length).toBeLessThanOrEqual(50);
  });
});
