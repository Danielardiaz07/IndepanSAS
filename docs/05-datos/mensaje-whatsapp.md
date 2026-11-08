# Formato del mensaje de WhatsApp

Se envía mediante `https://wa.me/<whatsappNumber>?text=<encodeURIComponent(mensaje)>`. Texto plano con formato de WhatsApp (`*negrita*`). Sin emojis excesivos; claro y escaneable.

## Plantilla
```
*Nuevo pedido — Indepan SAS*

*Cliente:* {nombre}
*Entrega:* {Recogida en tienda | Domicilio}
*Dirección:* {dirección}            ← solo si es domicilio
*Pago preferido:* {método}          ← si se indicó

*Productos:*
1. {producto} — {cantidad} × {precio por unidad} = {subtotal}
2. ...

*Total:* {total}

*Notas:* {notas}                    ← solo si existen

Total referencial; confírmenme precios y disponibilidad. ¡Gracias!
```
Cantidad: `2` (empaques), `1,5 kg` (por peso) o `250 g` (a granel). Precio por unidad: `$180.000`, `$26.000/kg`, `$47/g`.

## Ejemplo
```
*Nuevo pedido — Indepan SAS*

*Cliente:* Marta López
*Entrega:* Domicilio
*Dirección:* Cra 9 #12-30, Valledupar
*Pago preferido:* Transferencia bancaria

*Productos:*
1. Harina Corona Premium x 25 kg — 2 × $85.900 = $171.800
2. Fondant Rich x 1 kg — 1,5 kg × $26.000/kg = $39.000
3. Almendra Blanca a Granel — 250 g × $47/g = $11.750

*Total:* $222.550

*Notas:* Entregar por la mañana.

Total referencial; confírmenme precios y disponibilidad. ¡Gracias!
```
*(Datos de ejemplo. Moneda COP sin decimales. Implementado en `src/lib/whatsapp.ts` y probado en `src/lib/lib.test.ts`.)*

## Reglas
- Una línea por producto, numerada, en el orden del carrito.
- Cantidades sin ceros sobrantes (`2`, `1.5`).
- Omitir líneas opcionales vacías.
- Limpiar/recortar entradas del usuario; limitar longitud de notas y dirección.
- El total mostrado es referencial; la tienda confirma precio final.
- Si el mensaje supera ~2000 caracteres, mantener el formato pero avisar al usuario; no truncar productos.
- La lógica vive en una función pura y probada: `buildWhatsappMessage(cart, form, config)`.
