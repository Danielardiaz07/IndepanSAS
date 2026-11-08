# Modelo de datos (sin base de datos)

El catálogo vive en `src/data/products.ts`, tipado y validado. Las categorías aún no están definidas (ver `pendientes.md`), por lo que el modelo las admite de forma abierta.

## Producto
```ts
type UnitType = 'kg' | 'lb' | 'g' | 'l' | 'ml' | 'saco' | 'caja' | 'bolsa' | 'paquete' | 'unidad';

interface Product {
  id: string;            // slug único, estable (usado en URL y carrito)
  name: string;
  description: string;
  image: string;         // ruta en /public o URL permitida
  imageAlt: string;      // obligatorio por SEO/accesibilidad
  category?: string;     // id de categoría (opcional hasta definirlas)
  unit: UnitType;        // unidad de venta
  unitLabel?: string;    // texto mostrado, ej. "saco de 45 kg"
  price: number;         // precio por unidad, en la moneda de site config
  minQty: number;        // cantidad mínima
  step: number;          // incremento (1, 0.5, 0.25…)
  available: boolean;
  tags?: string[];
  featured?: boolean;
}
```

## Línea de carrito
```ts
interface CartItem {
  productId: string;
  qty: number;           // múltiplo de step, >= minQty
}
```
El carrito guarda solo `productId` y `qty`; nombre y precio se resuelven contra el catálogo vigente (RF-27). Clave de `localStorage`: `indepan:cart:v1`.

## Datos del pedido
```ts
interface OrderForm {
  customerName: string;
  delivery: 'pickup' | 'delivery';
  address?: string;      // obligatoria si delivery
  payment?: string;      // de la lista en site config
  notes?: string;
}
```

## Site config (`src/config/site.ts`)
Nombre (`Indepan`), descripción, URL, `whatsappNumber` (formato internacional sin `+`), dirección, ciudad (Valledupar, Cesar), horarios, coordenadas/mapa, redes, moneda (`code`, `symbol`, `locale`), métodos de pago, IDs de analítica.

## Reglas de validación
- `qty` ≥ `minQty` y múltiplo de `step` (con tolerancia de redondeo decimal).
- `id` único; `price` > 0; `imageAlt` no vacío.
- Cantidades se redondean a 2 decimales al calcular totales.
