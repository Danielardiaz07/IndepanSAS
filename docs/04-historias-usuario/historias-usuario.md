# Historias de usuario

Formato: *Como … quiero … para …*. Prioridad A/M/B. Se enlazan CU y RF.

## Épica 1 — Presentación
**HU-01 (A)** Como cliente, quiero ver el logo y una propuesta clara al entrar, para saber en segundos qué vende Indepan. *(CU-01, RF-01)*
- Dado que entro a la home, entonces veo logo, titular y dos llamadas a la acción visibles sin hacer scroll en móvil.

**HU-02 (A)** Como cliente, quiero conocer la historia y valores de la tienda, para confiar en comprar. *(CU-01, RF-03)*

**HU-03 (A)** Como cliente, quiero ver dirección, horarios y mapa, para saber dónde y cuándo ir. *(CU-08, RF-04)*

## Épica 2 — Catálogo
**HU-04 (A)** Como cliente, quiero ver los productos con imagen, descripción, unidad y precio, para decidir qué comprar. *(RF-11)*
- Cada tarjeta muestra el precio con su unidad (ej. "Q 12.00 / kg").

**HU-05 (A)** Como cliente, quiero un selector de cantidad adecuado a la unidad del producto, para pedir exactamente lo que necesito. *(CU-03, RF-12, RF-13)*
- Un producto por saco admite enteros; uno por kg puede admitir 0.5 si así se configura.

**HU-06 (M)** Como cliente, quiero filtrar por categoría y buscar por nombre, para encontrar rápido un insumo. *(CU-02, RF-14, RF-15)*

**HU-07 (M)** Como cliente, quiero saber si un producto no está disponible, para no pedirlo. *(RF-16)*

**HU-08 (M)** Como visitante desde Google, quiero llegar a una página propia de cada producto, para ver su información. *(RF-17, RF-50, RF-51)*

## Épica 3 — Carrito
**HU-09 (A)** Como cliente, quiero agregar productos al carrito, para armar mi pedido. *(CU-03, RF-20, RF-21)*

**HU-10 (A)** Como cliente, quiero editar cantidades y quitar ítems, para corregir mi pedido. *(CU-04, RF-22, RF-23)*
- El total se recalcula al instante.

**HU-11 (A)** Como cliente, quiero que mi carrito se conserve si recargo o cierro la página, para no perder mi selección. *(RF-25)*

**HU-12 (A)** Como cliente, quiero ver cuántos ítems llevo en todo momento, para tener control. *(RF-26)*

## Épica 4 — Pedido por WhatsApp
**HU-13 (A)** Como cliente, quiero indicar mi nombre y si recojo o pido a domicilio, para que la tienda sepa cómo atenderme. *(CU-05, RF-30–32)*
- Si elijo domicilio, la dirección es obligatoria; si elijo recogida, no aparece.

**HU-14 (M)** Como cliente, quiero indicar mi método de pago preferido y notas, para coordinar mejor. *(RF-33, RF-34)*

**HU-15 (A)** Como cliente, quiero enviar mi pedido por WhatsApp con un clic, ya redactado, para no escribirlo a mano. *(CU-06, RF-35–37)*
- El mensaje abre WhatsApp con productos, cantidades, unidades, precios, total, datos de entrega y notas.

**HU-16 (A)** Como equipo de la tienda, quiero recibir pedidos con un formato uniforme, para atenderlos más rápido y sin errores. *(RF-36)*

**HU-17 (M)** Como cliente, quiero un botón flotante de WhatsApp, para consultar dudas sin armar un pedido. *(CU-07, RF-05)*

## Épica 5 — Transversales
**HU-18 (A)** Como dueño, quiero que la web aparezca bien en Google, para atraer clientes de Valledupar, Cesar. *(RNF-01–04, RF-50–52)*

**HU-19 (M)** Como dueño, quiero medir visitas y pedidos enviados, para saber si la web funciona. *(RF-53)*

**HU-20 (M)** Como cliente, quiero modo oscuro, para leer cómodamente de noche. *(CU-09, RF-54)*

**HU-21 (A)** Como mantenedor, quiero editar productos y datos del negocio en archivos únicos, para actualizar sin tocar componentes. *(CU-10, RF-10, RF-40)*
