# Catálogo: método de organización (973 productos)

Fuente: `listado precio 30 de septiembre daniela.xlsx` (export del sistema de inventario, hoja `ExportarAExcel`).

## Diagnóstico del Excel
| Hallazgo | Dato |
|----------|------|
| Productos | 973 (códigos únicos, sin duplicados) |
| Categorías originales (`DescGrupoUno`) | 58; las 5 mayores concentran 52 % (Repostería 144, Varios 900 119, Desechables 111, Moldes 67, Esencias 62); 26 tienen 1–3 productos |
| Marcas/proveedores (`DescGrupoDos`) | ~100, con formato "PROVEEDOR - MARCA" |
| Estructura | Jerárquica con celdas vacías (hay que "rellenar hacia abajo" categoría y marca) |
| Unidad de venta | **No existe columna**; va dentro del nombre ("X 500 GR", "CAJA X 22.7 KG", "BULTO*9") |
| Tamaño detectable por regex | ~27 % (260 de 973); el resto requiere regla o revisión manual |
| Precios | COP; rango $33 – $1.670.000; **25 productos con precio 0** |
| Existencias | 335 productos con stock fraccionado (se venden por peso). Todos > 0 en este corte |
| Anomalías | 2 productos sin categoría; categoría "VARIOS 900" (119) mezcla todo; 4 productos "A GRANEL" con precio bajo (¿por gramo?); fila 3 con encabezados mal ubicados |
| Codificación | Tildes/ñ llegan corruptas en esta lectura ("DO�A ANA"); hay que corregir |

## Principio
**El Excel es la fuente de verdad; la web nunca se edita a mano para precios.** Un script transforma el Excel en datos tipados; las correcciones manuales viven aparte para no perderse al re-importar.

## Flujo
```
data/source/listado.xlsx
        │  scripts/build-catalog.ts
        ▼
 1. Leer + rellenar jerarquía (categoría, marca)
 2. Limpiar texto (codificación, mayúsculas → título, espacios)
 3. Normalizar categoría: 58 → ~12 departamentos (tabla de mapeo)
 4. Parsear tamaño/unidad del nombre (regex + reglas); si falla → unidad "und", paso 1
 5. Aplicar overrides manuales (por código)
 6. Validar (precios, duplicados, campos obligatorios) + reporte
        ▼
 src/data/generated/   (NO editar a mano)
   ├─ catalog-index.json      ← liviano: id, nombre, precio, depto, marca, imagen, disponible
   ├─ departments.json        ← departamentos y subcategorías con conteos
   ├─ products/<depto>.json   ← detalle por departamento
   └─ report.md               ← qué cambió, qué quedó sin resolver
src/data/overrides.ts        ← lo único que se edita a mano
```

### Overrides (por código de producto)
Permiten, sin tocar el Excel: nombre comercial limpio, descripción, imagen, `hidden`, `featured`, departamento corregido, unidad/paso/mínimo, etiquetas, orden. Sobreviven a cada re-importación.

## Taxonomía propuesta (departamentos)
Se consolidan las 58 categorías en departamentos claros para el cliente; la categoría original se conserva como subcategoría. Propuesta inicial (a validar con la tienda):

| Departamento | Absorbe (ejemplos) |
|--------------|-------------------|
| Harinas, premezclas y cereales | Harinas, Premezclas, Avena, Salvado, Pellets |
| Levaduras y mejoradores | Levadura, Mejoradores, Antimoho, Polvo para hornear, Bicarbonato, Cremor |
| Azúcar, sal y endulzantes | Azúcar, Sal, Glasse, Glicerina |
| Grasas y lácteos | Margarinas, Leche, Leche condensada, Queso, Hyvol |
| Rellenos y dulces | Arequipe, Bocadillo, Mermeladas, Rellenos, Cobertura, Chocolatería |
| Frutas y frutos secos | Frutos secos, Almendras, Frutas cristalizadas, Cerezas, Duraznos, Brevas, Ciruelas, Uva pasa, Coco, Cóctel |
| Esencias, colores y decoración | Esencias, Colores, Grageas, Velas, Obleas |
| Repostería y utensilios | Repostería, Libros, Varios 900 (reasignado por palabras clave) |
| Moldes | Moldes, Discos, Capacillos |
| Empaques y desechables | Bolsas, Cajas, Desechables, Envolturas, Vasos, Envases |
| Licores y vinos para repostería | Vinos |

`VARIOS 900` (119 ítems) se reasigna por palabras clave (molde, palo, cancha…) y el residuo se revisa a mano.

## Experiencia en la web (rendimiento con 973 ítems)
- **Navegación:** departamentos → subcategoría; buscador global; filtros por marca, rango de precio, disponibilidad.
- **Búsqueda:** índice en el cliente (MiniSearch/Fuse, ~100 KB comprimido), tolerante a tildes, mayúsculas y errores de tipeo; busca en nombre, marca y subcategoría.
- **Listado:** grilla paginada de 24 con "Ver más" (o virtualizada); nunca renderizar los 973 de una vez.
- **Carga de datos:** la página principal solo carga el índice liviano; el detalle por departamento se carga al entrar.
- **Producto:** tarjeta compacta (imagen, nombre, tamaño, precio, selector). Agregar al carrito sin salir de la lista.
- **Mayoristas:** accesos rápidos "Lo más pedido" y "Nuevos" vía `featured` en overrides.

## Imágenes
No existen imágenes por producto. Estrategia:
1. Placeholder ilustrado por departamento (nunca imagen rota).
2. Fotos reales progresivas: archivo `public/products/<codigo>.webp`; el script detecta y enlaza automáticamente.
3. Prioridad: ~60–100 productos más vendidos; el reporte lista cobertura de imágenes.

## SEO con catálogo grande
- Páginas de **departamento** indexables con texto propio y palabras clave locales ("insumos de panadería en Valledupar") — es el principal motor de SEO.
- Páginas de **producto** con JSON-LD `Product` (precio COP, disponibilidad); solo se indexan las que tengan precio > 0 y datos mínimos; el resto `noindex`.
- `sitemap.xml` generado desde el catálogo; generación estática (SSG).

## Reglas de negocio de datos
- Precio 0 → no se muestra como comprable (ver decisión pendiente P-15).
- Disponibilidad: `available = existencias > 0`. **Las existencias exactas no se publican.**
- Precios son referenciales y están sujetos a cambio (corte 30 de septiembre); mostrar la fecha del corte.
- Unidades fraccionadas: si el stock es fraccionado y el producto se vende por peso, paso 0.5 (a validar).
- "A GRANEL": el precio parece ser por gramo (47, 67.35, 33, 50) → confirmar antes de publicar (P-16).

## Actualización de precios
Nuevo Excel → `catalog:build` → `report.md` (nuevos, retirados, cambios de precio) → revisar → desplegar. Sin tocar componentes.
