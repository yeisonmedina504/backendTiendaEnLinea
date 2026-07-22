import { Router } from "express";
import {
  // Productos
  obtenerProductos,
  obtenerProductoPorId,
  obtenerProductoPorSKU,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  // Búsqueda
  buscarProductos,
  obtenerProductosPorCategoria,
  obtenerProductosPorMarca,
  obtenerProductosPorRangoPrecio,
  obtenerProductosConDescuento,
  obtenerProductosActivos,
  // Gestión de Inventario
  actualizarStock,
  productosBajoStock,
  productosSinStock,
  // Datos Relacionados
  obtenerProductoConCategoria,
  obtenerProductoConMarca,
  obtenerProductoCompleto,
} from "../controllers/productos.controllers";

const router = Router();

//  Productos
router.get("/productos", obtenerProductos);
router.get("/productos/:id_producto", obtenerProductoPorId);
router.get("/productos/sku/:SKU", obtenerProductoPorSKU);
router.post("/productos", crearProducto);
router.put("/productos/:id_producto", actualizarProducto);
router.delete("/productos/:id_producto", eliminarProducto);

// busqueda
router.get("/productos/buscar/:busqueda", buscarProductos);
router.get("/productos/categoria/:id_categoria", obtenerProductosPorCategoria);
router.get("/productos/marca/:id_marca", obtenerProductosPorMarca);
router.get(
  "/productos/precio/:precio_min/:precio_max",
  obtenerProductosPorRangoPrecio,
);
router.get("/productos/descuento", obtenerProductosConDescuento);
router.get("/productos/activos", obtenerProductosActivos);

// grestion de inventario
router.put("/productos/stock/:id_producto", actualizarStock);
router.get("/productos/bajo-stock", productosBajoStock);
router.get("/productos/sin-stock", productosSinStock);

//detalles del producto
router.get(
  "/productos/categoria-detalle/:id_producto",
  obtenerProductoConCategoria,
);
router.get("/productos/marca-detalle/:id_producto", obtenerProductoConMarca);
router.get("/productos/completo/:id_producto", obtenerProductoCompleto);

export default router;
