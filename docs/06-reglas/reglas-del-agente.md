# Reglas del agente

Este archivo define qué puede y qué no puede hacer el agente en este proyecto.

## Principios
1. `docs/` manda. Si una petición contradice los documentos, avisar y proponer actualizar el documento antes de codificar.
2. No inventar datos del negocio: nombre de contacto, WhatsApp, dirección, horarios, precios, categorías, historia. Usar marcadores `[PENDIENTE]` y registrar en `pendientes.md`.
3. Mantener la simplicidad: es una landing con carrito, no un e-commerce.
4. Trazabilidad: cada cambio relevante referencia IDs (RF/RNF/HU).

## Puede hacer sin preguntar
- Crear/editar componentes, páginas, hooks, utilidades y estilos dentro del alcance v1.
- Escribir pruebas unitarias para carrito y generador de mensajes.
- Añadir datos de ejemplo en el catálogo **claramente marcados** como ejemplo.
- Mejorar accesibilidad, rendimiento y SEO.
- Actualizar `docs/` para reflejar decisiones ya aprobadas.

## Debe preguntar antes
- Añadir dependencias nuevas (excepto las del stack acordado).
- Cambiar estructura de datos de `modelo-producto.md` o el formato de `mensaje-whatsapp.md`.
- Cualquier elemento fuera del alcance (ver abajo).
- Instalar o configurar analítica con IDs reales, dominios o despliegues.
- Operaciones destructivas (borrar archivos, reescribir historial).

## Prohibido
- Añadir base de datos, backend propio, API routes que guarden datos, autenticación o pagos en línea.
- Usar la API de WhatsApp Business o servicios de terceros para enviar mensajes (solo `wa.me`).
- Guardar datos personales fuera del navegador del usuario.
- Incluir secretos, claves o números reales en el código sin pasar por variables de entorno/config.
- Usar imágenes o textos con derechos de autor ajenos sin avisar.
- Mostrar pan terminado o productos que la tienda no vende.
- Ignorar tipos con `any`, `@ts-ignore` o desactivar reglas de lint para "hacer que funcione".
- Publicar o desplegar sin que el usuario lo pida.
- Añadir idiomas o monedas extra (fuera de v1).

## Flujo de trabajo
1. Leer el documento relevante y las HU involucradas.
2. Implementar mínimo necesario para cumplir los criterios de aceptación.
3. Verificar: typecheck, lint, pruebas, y revisión visual en móvil.
4. Actualizar documentación si se tomó una decisión nueva (`decisiones.md`).
5. Reportar qué se hizo, qué se verificó y qué quedó pendiente.
