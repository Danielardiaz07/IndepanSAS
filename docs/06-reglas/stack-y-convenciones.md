# Stack y convenciones

## Stack
- **Next.js** (App Router) + **TypeScript** estricto
- **Tailwind CSS**
- Estado del carrito: React Context + `useReducer` (o Zustand si se aprueba) con persistencia en `localStorage`
- Pruebas: Vitest + Testing Library para lógica y componentes críticos
- Analítica: Vercel Analytics y/o Google Analytics (IDs vía variables de entorno)
- Despliegue: Vercel
- Gestor de paquetes: **pnpm**
- Next.js **16.4.5** (Turbopack) con React 19 y Tailwind 4. Tailwind se conecta a Turbopack con la regla `turbopack.rules["*.css"]` de `next.config.ts` (sin ella el CSS no se genera). No se usa `cacheComponents`.
- Íconos: `lucide-react` (los logos de Instagram/Facebook están dibujados en `components/ui/icons.tsx`)
- Búsqueda del catálogo: `minisearch` en el cliente, sobre `catalog-compact.json` cargado bajo demanda

## Estructura propuesta
```
/
├─ CLAUDE.md
├─ docs/
├─ public/
│  ├─ brand/            # logo, favicon
│  └─ products/         # imágenes de producto
└─ src/
   ├─ app/              # rutas, layout, sitemap.ts, robots.ts, opengraph
   │  └─ productos/[slug]/
   ├─ components/
   │  ├─ layout/        # Header, Footer, WhatsAppFab, ThemeToggle
   │  ├─ sections/      # Hero, About, Catalog, Location
   │  ├─ catalog/       # ProductCard, QuantitySelector, Filters
   │  └─ cart/          # CartDrawer, CartItem, OrderForm
   ├─ config/site.ts    # datos del negocio
   ├─ data/products.ts  # catálogo
   ├─ lib/              # cart, format, whatsapp, seo, analytics
   └─ types/
```

## Convenciones
- Componentes server por defecto; `"use client"` solo donde haya interacción (carrito, tema, formulario).
- Nombres de archivo en kebab-case; componentes en PascalCase; textos de UI en español.
- Sin números mágicos: datos del negocio solo desde `config/site.ts`.
- Lógica de dominio (carrito, totales, mensaje) en `lib/` como funciones puras con pruebas.
- Imágenes siempre con `next/image` y `alt`.
- Tailwind: tokens de marca en config; evitar colores hard-coded.
- Commits pequeños y descriptivos; solo cuando el usuario lo pida.

## Variables de entorno
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID` (opcional). El número de WhatsApp vive en `config/site.ts` (es público por naturaleza).


## Estructura real
```
data/source/listado.xlsx        # export del inventario (fuente de verdad de precios)
scripts/build-catalog.ts        # Excel → src/data/generated
scripts/catalog/                # config (departamentos, reglas), normalize (+ pruebas)
src/config/site.ts              # datos del negocio
src/data/overrides.ts           # correcciones manuales por código
src/data/generated/             # products.json, catalog-compact.json, departments.json, report.md
src/lib/                        # cart, format, whatsapp, seo, catalog (servidor), compact-catalog (cliente)
src/components/{layout,sections,catalog,cart,ui}
src/app/                        # /, /productos, /productos/[departamento], /productos/[departamento]/[slug]
public/brand, public/products   # logo e imágenes (products/<codigo>.webp se enlaza solo)
```

## Patrones de React que el lint exige
- Nada de `setState` dentro de `useEffect` para sincronizar: usar `useSyncExternalStore` (carrito, tema, `?q=`, abierto ahora) o estado derivado.
- El panel del carrito se monta solo mientras está abierto (reinicia estado transitorio).
- Animaciones de entrada nunca parten de `opacity: 0` (protege el LCP).
