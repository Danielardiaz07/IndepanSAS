# Marca y diseño

## Identidad
- **Nombre público:** Indepan SAS (en textos cortos y logo: "Indepan"). Instagram: @insumosindepan — "INDEPAN | Insumos de Panadería y Repostería"
- **Ciudad:** Valledupar, Cesar
- **Dirección:** Calle 21 #17-39, sector Mercado, Valledupar, Cesar
- **Rubro:** insumos para panadería (no pan terminado)
- **Logo:** ilustración de un chef panadero con gorro, bigote y delantal rojo, sosteniendo una dona y un pan, sobre un círculo naranja degradado. Estilo cartoon con contorno marrón.

## Archivos de marca (`public/brand/`)
| Archivo | Uso |
|---------|-----|
| `logo-original.webp` | Original recibido (760×760). No modificar |
| `logo-2048.png/.webp` | Master reescalado (Lanczos + nitidez leve), transparente |
| `logo-1024/512/256.png/.webp` | Tamaños para web (usar vía `next/image`) |
| `favicon.ico`, `favicon-32.png` | Favicon |
| `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png` | iOS / PWA |
| `og-base.png` (1200×630) | Base de la imagen Open Graph (fondo crema + logo) |

Limitación: el logo es raster. El reescalado mejora nitidez y bordes pero no añade detalle real. Para impresión o tamaños grandes se recomienda pedir el original vectorial (SVG/AI) o un redibujado — ver P-01.

## Paleta (extraída del logo)
| Token | Hex aprox. | Origen |
|-------|-----------|--------|
| `brand-orange` | `#F89818` | Círculo (zona clara) |
| `brand-orange-deep` | `#F85808` | Círculo (zona intensa) |
| `brand-red` | `#E84838` | Delantal |
| `brand-brown` | `#583828` | Contornos |
| `cream` | `#F8F8E8` | Gorro/uniforme → fondos cálidos |
| `ink` | `#080808` | Texto de alto contraste (ajustar) |

Notas:
- Naranja sobre blanco tiene bajo contraste para texto: usar `brand-brown`/tinta oscura para texto y reservar el naranja para fondos de botón con texto oscuro, o un naranja más oscuro validado AA.
- Definir tokens una sola vez (Tailwind/variables CSS) y validar AA en modo claro y oscuro.
- Fondo claro sugerido: crema cálido, no blanco puro. Modo oscuro: marrón muy oscuro derivado de `brand-brown`, no negro puro.

## Tono y contenido
- Español cercano, profesional y confiable. Foco en el oficio: calidad de insumos, abastecimiento, atención al panadero.
- No inventar datos del negocio (años, certificaciones, cifras). Usar `[PENDIENTE]`.
- **Ojo de coherencia:** el logo muestra dona y pan (producto terminado), pero la tienda vende insumos. La web debe aclararlo en hero y SEO (p. ej. "insumos para panadería y pastelería") para no atraer búsquedas equivocadas. El catálogo no mostrará producto terminado.

## Principios de UI
- Mobile-first, tarjetas de producto limpias, CTA de WhatsApp siempre accesible.
- Imágenes de producto con proporción uniforme.
- Animaciones sutiles; respetar `prefers-reduced-motion`.
- Datos de ejemplo del catálogo etiquetados como tales y reemplazados antes de publicar.
