# Requisitos funcionales

Prioridad: **A** alta · **M** media · **B** baja.

## Contenido y navegación
| ID | Requisito | Prio |
|----|-----------|------|
| RF-01 | La página muestra el logo y nombre "Indepan" en cabecera y hero | A |
| RF-02 | Navegación por anclas a: Inicio, Nosotros, Productos, Ubicación; menú adaptable a móvil | A |
| RF-03 | Sección "Sobre nosotros" con texto editable desde site config/contenido | A |
| RF-04 | Sección de ubicación con dirección, horarios y mapa/enlace a Google Maps | A |
| RF-05 | Botón flotante de WhatsApp visible en toda la página que abre chat directo | M |

## Catálogo
| ID | Requisito | Prio |
|----|-----------|------|
| RF-10 | El catálogo se carga desde un archivo local tipado (sin base de datos) | A |
| RF-11 | Cada producto muestra imagen, nombre, descripción, unidad de venta y precio por unidad | A |
| RF-12 | Cada producto define su unidad (kg, lb, g, saco, caja, bolsa, unidad…) y su paso de cantidad y mínimo | A |
| RF-13 | Selector de cantidad respeta el paso/mínimo del producto (enteros o fraccionados) | A |
| RF-14 | Productos agrupables por categoría; filtro por categoría (cuando existan) | M |
| RF-15 | Búsqueda por texto en el catálogo | M |
| RF-16 | Productos pueden marcarse como no disponibles y no se pueden agregar | M |
| RF-17 | Cada producto tiene página/vista de detalle indexable (URL propia) | M |

## Carrito
| ID | Requisito | Prio |
|----|-----------|------|
| RF-20 | Agregar un producto con su cantidad al carrito | A |
| RF-21 | Si el producto ya está, se suma la cantidad en lugar de duplicar | A |
| RF-22 | Editar cantidad y eliminar ítems desde el carrito | A |
| RF-23 | Mostrar subtotal por ítem y total del pedido | A |
| RF-24 | Vaciar el carrito completo (con confirmación) | M |
| RF-25 | El carrito persiste en `localStorage` y se restaura al recargar | A |
| RF-26 | Indicador con cantidad de ítems en la cabecera/botón del carrito | A |
| RF-27 | Si un producto cambió de precio o desapareció, el carrito se revalida al cargar | M |

## Pedido y WhatsApp
| ID | Requisito | Prio |
|----|-----------|------|
| RF-30 | Formulario con nombre del cliente (obligatorio) | A |
| RF-31 | Elegir tipo de entrega: recogida o domicilio | A |
| RF-32 | Si es domicilio, dirección/referencias obligatorias; si es recogida, no se piden | A |
| RF-33 | Elegir método de pago preferido (lista configurable) | M |
| RF-34 | Campo de notas opcional | M |
| RF-35 | Botón "Enviar pedido por WhatsApp" abre `https://wa.me/<número>?text=<mensaje codificado>` | A |
| RF-36 | El mensaje sigue el formato definido en `mensaje-whatsapp.md` | A |
| RF-37 | No se permite enviar con el carrito vacío o con datos obligatorios incompletos | A |
| RF-38 | Tras enviar, se ofrece conservar o vaciar el carrito | B |

## Configuración
| ID | Requisito | Prio |
|----|-----------|------|
| RF-40 | Datos del negocio (nombre, WhatsApp, dirección, horarios, moneda, redes) centralizados en un único site config | A |
| RF-41 | Moneda y formato de precio definidos en la configuración | A |

## SEO y analítica
| ID | Requisito | Prio |
|----|-----------|------|
| RF-50 | Metadatos, Open Graph y Twitter Card por página | A |
| RF-51 | Datos estructurados JSON-LD (LocalBusiness, ItemList/Product) | A |
| RF-52 | `sitemap.xml` y `robots.txt` generados | A |
| RF-53 | Eventos de analítica: ver producto, agregar al carrito, iniciar pedido, enviar por WhatsApp | M |
| RF-54 | Modo oscuro/claro con preferencia recordada | M |
