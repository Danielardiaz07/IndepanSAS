# Registro de decisiones

| ID | Fecha | Decisión | Motivo |
|----|-------|----------|--------|
| D-01 | 2026-11-07 | La tienda vende **insumos de panadería**, no pan terminado | Aclaración del cliente |
| D-02 | 2026-11-07 | Entrega: recogida y domicilio, a elección del cliente | Flexibilidad; define campos del formulario |
| D-03 | 2026-11-07 | Catálogo en archivo local TypeScript, sin base de datos | Simplicidad y costo cero |
| D-04 | 2026-11-07 | Unidades variables por producto (kg, lb, saco, etc.) con `step` y `minQty` | Los insumos se venden de formas distintas |
| D-05 | 2026-11-07 | Categorías diferidas: se diseña un esqueleto y se completa con la información real | El cliente aún no tiene la lista |
| D-06 | 2026-11-07 | Solo español y una moneda (definida en site config) | Alcance v1 |
| D-07 | 2026-11-07 | Pago: solo se indica el método preferido en el mensaje; el cobro se coordina por WhatsApp | Sin pasarela de pagos |
| D-08 | 2026-11-07 | Secciones v1: Hero+Nosotros, Catálogo+Carrito, Ubicación/Horarios/Mapa (sin testimonios/FAQ) | Elección del cliente |
| D-09 | 2026-11-07 | Carrito persistente en `localStorage` | Mejor experiencia sin servidor |
| D-10 | 2026-11-07 | Extras v1: SEO avanzado (prioridad alta), botón flotante WhatsApp, analítica, modo oscuro | Elección del cliente |
| D-11 | 2026-11-07 | Stack: Next.js App Router + TypeScript + Tailwind, desplegado en Vercel | Recomendado y aceptado |
| D-12 | 2026-11-07 | Nombre público: **Indepan SAS**; paleta extraída del logo | Dato del cliente |
| D-13 | 2026-11-07 | Dirección: Cll 21 #17-39, Valledupar, Cesar. Logo procesado en `public/brand/` | Dato del cliente |
| D-14 | 2026-11-07 | WhatsApp de la empresa: 3006739631 (local). Para `wa.me` se usará `573006739631` si se confirma Colombia | Dato del cliente |
| D-15 | 2026-11-07 | La ciudad es **Valledupar, Cesar** (no Ayudapa). País Colombia (+57); moneda **COP** sin decimales | Confirmado por el cliente |
| D-16 | 2026-11-07 | WhatsApp definitivo: `573006739631` | Confirmado (coincide con wa.me del Instagram) |
| D-17 | 2026-11-07 | Pagos aceptados: efectivo, transferencia bancaria, código QR | Historia de Instagram "Medios de pago" |
| D-18 | 2026-11-07 | El catálogo (973 productos) se genera desde el Excel del ERP con un script; correcciones manuales en un archivo de overrides | Ver `05-datos/catalogo-pipeline.md` |
| D-19 | 2026-11-07 | Productos con precio 0 se muestran como "Consultar precio" (no entran al carrito; botón a WhatsApp) | Elección del cliente |
| D-20 | 2026-11-07 | Se aprueba la agrupación de 58 categorías en ~11 departamentos (ver catalogo-pipeline.md) | Elección del cliente |
| D-21 | 2026-11-07 | Imágenes: placeholder por departamento y fotos reales progresivas (`public/products/<codigo>.webp`) | Elección del cliente |
| D-22 | 2026-11-07 | Precios visibles con aviso "precios referenciales, corte DD/MM"; el valor final lo confirma la tienda | Elección del cliente |
| D-23 | 2026-11-07 | Sábado cierra a las 3:00 p. m. Facebook: facebook.com/indepan.sas.39 | Confirmado por el cliente |
| D-24 | 2026-11-07 | Productos "A GRANEL": precio por gramo; se venden por gramos (paso a definir, p. ej. 100 g) y el carrito muestra gramos/kg | Confirmado por el cliente |
| D-25 | 2026-11-07 | Sin fotos de producto al lanzamiento: solo placeholders por departamento | Cliente aún no tiene fotos |
| D-26 | 2026-11-07 | Gestor de paquetes pnpm; Next.js 16.4.5 sin `cacheComponents`; Tailwind vía regla de Turbopack | Scaffold oficial; el proyecto es estático |
| D-27 | 2026-11-07 | Búsqueda en el cliente con minisearch y catálogo compacto cargado bajo demanda | 973 productos caben en ~40 KB comprimidos |
| D-28 | 2026-11-07 | Del skill `impeccable` se aplicaron sus reglas de diseño, pero no se ejecutó su launcher (descarga y corre un binario externo) ni sus hooks | Seguridad: no ejecutar código no verificado sin autorización |
| D-29 | 2026-11-07 | Los productos sin precio llevan `noindex` y no entran al sitemap | SEO: solo se indexan páginas con datos completos |
| D-30 | 2026-11-08 | Enfoque mobile-first: en móvil la navegación vive en una barra inferior (Inicio, Productos, Pedido, Ubicación, WhatsApp); el encabezado solo lleva logo y tema. El botón flotante de WhatsApp queda solo en pantallas md+ | Feedback del cliente: en móvil no había acceso directo a productos |
| D-31 | 2026-11-08 | Hero móvil sin mascota: título, buscador, dos botones y accesos rápidos a departamentos caben en la primera pantalla. La mascota se muestra desde md | Feedback del cliente: el hero se veía largo y desordenado |
| D-32 | 2026-11-08 | Solo la barra de búsqueda es fija en el catálogo; filtros y orden se desplazan con la página | La barra completa ocupaba ~1/3 de la pantalla móvil |
| D-33 | 2026-11-08 | Controles táctiles de 44 px como mínimo y texto de al menos 13 px | Usabilidad y accesibilidad móvil |

