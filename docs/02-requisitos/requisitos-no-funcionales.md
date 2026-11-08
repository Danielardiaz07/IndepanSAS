# Requisitos no funcionales

| ID | Categoría | Requisito | Verificación |
|----|-----------|-----------|--------------|
| RNF-01 | SEO | Lighthouse SEO ≥ 95 en móvil y escritorio; un solo `<h1>` por página, jerarquía de encabezados correcta | Lighthouse |
| RNF-02 | SEO | SEO local para "insumos de panadería en Valledupar, Cesar" y variantes; palabras clave en títulos, descripciones y contenido | Revisión manual |
| RNF-03 | SEO | HTML semántico, renderizado en servidor/estático (SSG), texto indexable sin depender de JS | Inspección de fuente |
| RNF-04 | SEO | URLs limpias, canonical, `lang="es"`, imágenes con `alt` descriptivo | Revisión |
| RNF-05 | Rendimiento | Lighthouse Performance ≥ 90 móvil; LCP < 2.5 s, CLS < 0.1, INP < 200 ms | Lighthouse / Vercel |
| RNF-06 | Rendimiento | Imágenes con `next/image`, formatos modernos, tamaños responsivos y carga diferida | Revisión |
| RNF-07 | Accesibilidad | Lighthouse Accessibility ≥ 95; WCAG 2.1 AA; navegación por teclado; contraste suficiente en claro y oscuro | Lighthouse / manual |
| RNF-08 | Responsive | Mobile-first; funcional desde 320 px; el público usa principalmente móvil | Pruebas |
| RNF-09 | Usabilidad | De producto a envío de pedido en ≤ 4 pasos; botones táctiles ≥ 44 px | Prueba manual |
| RNF-10 | Compatibilidad | Últimas 2 versiones de Chrome, Safari, Edge, Firefox; iOS Safari y Android Chrome | Pruebas |
| RNF-11 | Privacidad | No se almacenan datos personales en servidor; solo `localStorage` en el navegador; analítica con aviso si la ley lo exige | Revisión |
| RNF-12 | Seguridad | Sin secretos en el cliente; mensaje de WhatsApp correctamente codificado (sin inyección); cabeceras seguras en Vercel | Revisión |
| RNF-13 | Mantenibilidad | TypeScript estricto, componentes pequeños y reutilizables, catálogo y config tipados y validados | Compilación / lint |
| RNF-14 | Mantenibilidad | Actualizar un producto o dato del negocio no requiere tocar componentes | Revisión |
| RNF-15 | Calidad | Lint y typecheck sin errores; pruebas unitarias para la lógica del carrito y del generador de mensajes | CI local |
| RNF-16 | Disponibilidad | Hosting estático/edge en Vercel; sin dependencias de backend propio | Despliegue |
| RNF-17 | Localización | Interfaz solo en español; formato de precios y números según config | Revisión |
| RNF-18 | Usabilidad móvil | Navegación principal accesible con el pulgar (barra inferior); acciones clave (buscar, ver productos, contactar) visibles sin desplazarse; sin desbordamiento horizontal desde 320 px | Prueba en emulación 320/360/390 px |
| RNF-19 | Accesibilidad | Controles táctiles ≥ 44 px, texto ≥ 13 px, un solo h1 por página, imágenes con alt, funciona con modo claro y oscuro; Lighthouse accesibilidad 100 en ambos temas | Lighthouse + auditoría con script |
| RNF-20 | Accesibilidad | La página no desborda horizontalmente ni corta texto con letra del sistema al 100 %, 150 % y 200 %, en anchos de 320, 360 y 390 px | Auditoría con emulación (script CDP) |

