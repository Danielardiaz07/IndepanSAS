# Indepan — Documentación núcleo

Fuente de verdad del proyecto. El agente debe consultarla antes de actuar.

## Orden de lectura

| # | Archivo | Contenido |
|---|---------|-----------|
| 00 | [vision.md](00-contexto/vision.md) | Qué es el proyecto, para quién y por qué |
| 00 | [glosario.md](00-contexto/glosario.md) | Términos del dominio |
| 01 | [alcance.md](01-alcance/alcance.md) | Qué entra y qué NO entra en la v1 |
| 02 | [requisitos-funcionales.md](02-requisitos/requisitos-funcionales.md) | RF-xx |
| 02 | [requisitos-no-funcionales.md](02-requisitos/requisitos-no-funcionales.md) | RNF-xx (SEO, rendimiento, accesibilidad…) |
| 03 | [casos-de-uso.md](03-casos-de-uso/casos-de-uso.md) | CU-xx |
| 04 | [historias-usuario.md](04-historias-usuario/historias-usuario.md) | HU-xx con criterios de aceptación |
| 05 | [modelo-producto.md](05-datos/modelo-producto.md) | Estructura de datos del catálogo y del carrito |
| 05 | [mensaje-whatsapp.md](05-datos/mensaje-whatsapp.md) | Formato exacto del pedido enviado |
| 05 | [marca-y-diseno.md](05-datos/marca-y-diseno.md) | Identidad visual y contenido |
| 05 | [negocio.md](05-datos/negocio.md) | Dirección, horarios, pagos, redes |
| 05 | [catalogo-pipeline.md](05-datos/catalogo-pipeline.md) | Cómo se organiza y publica el catálogo (973 productos) |
| 06 | [reglas-del-agente.md](06-reglas/reglas-del-agente.md) | Qué puede y qué NO puede hacer el agente |
| 06 | [stack-y-convenciones.md](06-reglas/stack-y-convenciones.md) | Tecnología, estructura de código, estilo |
| 06 | [decisiones.md](06-reglas/decisiones.md) | Registro de decisiones (ADR corto) |
| 06 | [pendientes.md](06-reglas/pendientes.md) | Datos y decisiones aún abiertas |

## Convenciones de IDs

`RF-` requisito funcional · `RNF-` no funcional · `CU-` caso de uso · `HU-` historia de usuario · `D-` decisión · `P-` pendiente.
Todo código o tarea debe poder trazarse a al menos un ID.

## Mantenimiento

- Cambio de alcance → actualizar `alcance.md` y registrar en `decisiones.md`.
- Dato nuevo que cierra un pendiente → moverlo de `pendientes.md` al documento correspondiente.
