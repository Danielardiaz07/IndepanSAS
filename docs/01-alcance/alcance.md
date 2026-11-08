# Alcance v1

## Dentro del alcance

### Secciones de la landing
1. **Hero**: logo, propuesta de valor, llamadas a la acción (ver catálogo / pedir por WhatsApp).
2. **Sobre nosotros**: historia, esencia, valores, por qué elegirnos.
3. **Catálogo de productos**: tarjetas con imagen, nombre, descripción, unidad, precio por unidad, selector de cantidad y botón agregar. Filtro/búsqueda por categoría (cuando existan categorías).
4. **Carrito**: panel/sección con ítems, cantidades editables, subtotal, total, vaciar.
5. **Datos del pedido**: nombre, tipo de entrega (recogida/domicilio), dirección si es domicilio, método de pago preferido, notas.
6. **Envío a WhatsApp**: abre `wa.me` con el mensaje estructurado.
7. **Ubicación, horarios y mapa**: dirección en Valledupar, Cesar, horarios, mapa embebido o enlace.
8. **Footer**: contacto, redes (si existen), aviso legal mínimo.

### Funcionalidad transversal
- Carrito persistente en `localStorage`.
- Botón flotante de WhatsApp.
- Modo oscuro (claro/oscuro/sistema).
- SEO avanzado: metadatos, Open Graph, datos estructurados (LocalBusiness, Product/ItemList), sitemap, robots, URLs limpias. **Prioridad alta.**
- Analítica: Google Analytics y/o Vercel Analytics, con eventos de carrito y envío.
- Solo español; una sola moneda definida en site config.
- Catálogo en archivo local TypeScript (sin base de datos).
- Despliegue en Vercel.

## Fuera del alcance (v1)
- Base de datos, backend propio o panel de administración.
- Pagos en línea, pasarelas, facturación.
- Cuentas de usuario, login, historial de pedidos.
- Gestión de inventario/stock en tiempo real.
- Cálculo de costo de envío por distancia.
- Multi-idioma y multi-moneda.
- Integración con la API de WhatsApp Business (solo enlace `wa.me`).
- Blog, e-commerce con checkout propio.

## Supuestos
- El pedido se confirma y cobra manualmente por WhatsApp.
- Los precios del catálogo son referenciales y los actualiza el equipo editando el archivo.
- El catálogo final llegará después; se construye el esqueleto con datos de ejemplo claramente marcados.

## Criterio de "terminado" v1
Todas las HU de prioridad Alta cumplidas, RNF verificados (Lighthouse), mensaje de WhatsApp validado con la tienda y datos reales cargados (ver `pendientes.md`).
