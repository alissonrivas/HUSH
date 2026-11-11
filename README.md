# HUSH — Marketplace de moda (front-end)

Sitio web responsive construido con HTML, CSS y JavaScript vanilla. No requiere instalación de paquetes: abre `index.html` en un navegador o publica los tres archivos principales en un hosting estático.

## Archivos

- `index.html`: estructura semántica, navegación, catálogo, formularios y diálogos.
- `style.css`: diseño responsive, estados, accesibilidad visual y componentes.
- `script.js`: catálogo de demostración, filtros, búsqueda, favoritos, carrito y publicación local.

## Funcionalidades disponibles en esta versión

- Catálogo con búsqueda por texto, filtros por categoría y marca, y orden por precio o nombre.
- Vista de detalle de cada prenda.
- Carrito con cantidades, eliminación de productos, subtotal y persistencia local.
- Favoritos con persistencia local.
- Formulario de publicación que agrega la prenda al catálogo y la conserva en el navegador.
- Menú móvil, aviso superior descartable, formulario de novedades de demostración y mensajes de estado.
- Diseño adaptable a móvil, tablet y escritorio; etiquetas accesibles, controles por teclado y preferencia de movimiento reducido.

Los datos del carrito, favoritos, aviso cerrado y publicaciones se guardan en `localStorage` del navegador. No se envían a un servidor.

## Importante antes de un lanzamiento real

Esta entrega es un **prototipo front-end funcional**, no una plataforma de comercio electrónico lista para procesar operaciones reales. Para lanzar HUSH públicamente y permitir que varias personas compren y vendan entre sí, hace falta conectar, como mínimo:

1. **Backend y base de datos:** catálogo central, cuentas, vendedores, inventario, publicaciones, pedidos y estados de entrega.
2. **Autenticación y permisos:** registro, inicio/cierre de sesión, recuperación de cuenta y control de acceso para editar o retirar publicaciones.
3. **Pagos y pedidos:** proveedor de pagos compatible con el país, confirmación de transacciones, reembolsos, impuestos, comisiones y comprobantes. No se deben guardar datos de tarjetas en este sitio.
4. **Imágenes:** carga de archivos a almacenamiento seguro, validación de tipo/tamaño y moderación de contenido. El formulario actual acepta solo URL HTTPS.
5. **Confianza y soporte:** políticas de compra/venta, privacidad, términos, devoluciones, artículos prohibidos, reportes, contacto y verificación de vendedores cuando corresponda.
6. **Operación:** logística o acuerdos de entrega, notificaciones por correo, monitoreo, copias de seguridad, HTTPS y pruebas de seguridad.

La búsqueda, el carrito y los favoritos funcionan en el navegador con datos de demostración. El botón de compra no procesa pagos; el formulario de novedades no envía correos; y las publicaciones son locales al dispositivo donde se crean.

## Personalización rápida

En `script.js`, edita el arreglo `starterProducts` para cambiar los productos iniciales. Cada producto usa estas propiedades: `id`, `title`, `price`, `category`, `brand`, `seller`, `condition`, `badge`, `description` e `image`.

Las imágenes del catálogo de ejemplo se sirven desde Unsplash y requieren conexión a internet. Sustitúyelas por fotografías propias y autorizadas antes de publicar el sitio.
