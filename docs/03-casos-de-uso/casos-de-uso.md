# Casos de uso

**Actores:** Visitante/Cliente · Equipo de la tienda (recibe el WhatsApp) · Mantenedor (edita catálogo/config en el código).

## CU-01 Explorar la tienda
- **Actor:** Cliente · **RF:** 01–04
- **Flujo:** entra a la web → ve hero → navega a Nosotros, Productos, Ubicación.
- **Resultado:** entiende qué es Indepan y qué vende.

## CU-02 Buscar y filtrar productos
- **Actor:** Cliente · **RF:** 14, 15
- **Flujo:** escribe en el buscador o elige categoría → la lista se filtra.
- **Alterno:** sin resultados → mensaje y sugerencia de contactar por WhatsApp.

## CU-03 Agregar producto al carrito
- **Actor:** Cliente · **RF:** 12, 13, 20, 21, 25, 26
- **Precondición:** producto disponible.
- **Flujo:** ajusta cantidad según la unidad del producto → pulsa "Agregar" → el carrito se actualiza y se guarda.
- **Alterno:** cantidad menor al mínimo o fuera de paso → se corrige/avisa. Producto ya en carrito → suma cantidades.

## CU-04 Gestionar el carrito
- **Actor:** Cliente · **RF:** 22–24
- **Flujo:** abre el carrito → cambia cantidades, elimina ítems o vacía → ve total actualizado.

## CU-05 Completar datos del pedido
- **Actor:** Cliente · **RF:** 30–34
- **Flujo:** ingresa nombre → elige recogida/domicilio → (domicilio: dirección) → método de pago → notas.
- **Alterno:** datos obligatorios faltantes → errores visibles junto al campo.

## CU-06 Enviar pedido por WhatsApp
- **Actor:** Cliente · **RF:** 35–38
- **Precondición:** carrito con ítems y datos válidos.
- **Flujo:** pulsa "Enviar por WhatsApp" → se genera el mensaje → se abre WhatsApp con el texto → el cliente lo envía.
- **Postcondición:** el equipo recibe un pedido estructurado; se registra evento de analítica.
- **Alterno:** el navegador bloquea la apertura → se muestra enlace manual y opción de copiar el mensaje.

## CU-07 Contactar directamente
- **Actor:** Cliente · **RF:** 05
- **Flujo:** pulsa el botón flotante → abre chat de WhatsApp con saludo predefinido.

## CU-08 Ver ubicación y horarios
- **Actor:** Cliente · **RF:** 04
- **Flujo:** va a la sección → ve dirección, horarios y mapa.

## CU-09 Cambiar tema claro/oscuro
- **Actor:** Cliente · **RF:** 54

## CU-10 Actualizar catálogo o datos del negocio
- **Actor:** Mantenedor · **RF:** 10, 40, 41
- **Flujo:** edita el archivo de catálogo o site config → valida tipos → despliega en Vercel.
