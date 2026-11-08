# Indepan SAS — Instrucciones para el agente

Antes de escribir código o proponer cambios, lee `docs/README.md` y `docs/06-reglas/reglas-del-agente.md`.
La carpeta `docs/` es la **fuente de verdad** del proyecto. Si algo no está allí o contradice lo que se pide, pregunta antes de actuar y actualiza los documentos cuando se tome una decisión.

Este proyecto usa **Next.js 16** (cambios respecto a versiones anteriores): antes de usar una API, consulta `node_modules/next/dist/docs/` (ver `AGENTS.md`).

## Comandos (pnpm)
- `pnpm dev` / `pnpm build` / `pnpm start` — desarrollo, build y servidor de producción
- `pnpm catalog:build` — regenera `src/data/generated/*` desde `data/source/listado.xlsx` (no editar lo generado)
- `pnpm test` · `pnpm typecheck` · `pnpm lint`

## Datos
- Catálogo: Excel → script → `src/data/generated/`. Correcciones manuales solo en `src/data/overrides.ts`.
- Datos del negocio (contacto, horarios, pagos, redes, corte de precios): únicamente `src/config/site.ts`.
