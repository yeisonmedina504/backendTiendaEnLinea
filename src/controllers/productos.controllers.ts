import { Request, Response } from "express";
import { getConnection } from "../database/connections";
import sql from "mssql";

/**
 *
 * Obtener el listado de productos
 */
export const obtenerProductos = async (req: Request, res: Response) => {
  const pool = await getConnection();
  if (!pool) {
    return res.status(500).json({ message: "Database connection error" });
  }
  const result = await pool.request().query("SELECT * FROM inventario");
  return res.json(result.recordset);
};

/**
 *
 * Obtener el listado de productos por su id
 */
export const obtenerProductoPorId = async (req: Request, res: Response) => {
  const pool = await getConnection();
  if (!pool) {
    return res.status(500).json({ message: "No se pudo acceder a la tabla" });
  }
  const result = await pool
    .request()
    .input("id_producto", sql.Int, req.params.id_producto)
    .query("SELECT * FROM inventario WHERE id_producto = @id_producto");

  if (result.rowsAffected[0] === 0) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  return res.json(result.recordset);
};

/**
 *
 * Obtener el listado de productos por su SKU
 */
export const obtenerProductoPorSKU = async (req: Request, res: Response) => {
  const pool = await getConnection();
  if (!pool) {
    return res.status(500).json({ message: "No se pudo acceder a la tabla" });
  }

  const result = await pool
    .request()
    .input("SKU", sql.VarChar, req.params.SKU)
    .query("SELECT * FROM inventario WHERE SKU = @SKU");

  if (result.rowsAffected[0] === 0) {
    return res.status(404).json({ message: "Producto no encontrado por SKU" });
  }

  return res.json(result.recordset);
};

/**
 *
 * Creando un producto en la base de datos
 */
export const crearProducto = async (req: Request, res: Response) => {
  const pool = await getConnection();
  if (!pool) {
    return res.status(500).json({ message: "Database connection error" });
  }

  const result = await pool
    .request()
    .input("SKU", sql.VarChar, req.body.SKU)
    .input("nombre_productos", sql.VarChar, req.body.nombre_productos)
    .input("descripcion", sql.VarChar, req.body.descripcion)
    .input("stock_actual", sql.Int, req.body.stock_actual)
    .input("stock_minimo", sql.Int, req.body.stock_minimo)
    .input("descuento", sql.Decimal, req.body.descuento)
    .input("PrecioVenta", sql.Decimal, req.body.PrecioVenta)
    .input("id_categoria", sql.Int, req.body.id_categoria)
    .input("id_marca", sql.Int, req.body.id_marca)
    .query(
      `INSERT INTO inventario(SKU, nombre_productos, descripcion, stock_actual, stock_minimo, descuento, PrecioVenta, id_categoria, id_marca) 
       VALUES(@SKU, @nombre_productos, @descripcion, @stock_actual, @stock_minimo, @descuento, @PrecioVenta, @id_categoria, @id_marca)`,
    );

  return res.json({ message: "Producto creado exitosamente" });
};

/**
 *
 * Actualizar producto mediante su id
 */
export const actualizarProducto = async (req: Request, res: Response) => {
  const pool = await getConnection();
  if (!pool) {
    return res
      .status(500)
      .json({ message: "No se ha establecido la conexion" });
  }

  const result = await pool
    .request()
    .input("id_producto", sql.Int, req.params.id_producto)
    .input("SKU", sql.VarChar, req.body.SKU)
    .input("nombre_productos", sql.VarChar, req.body.nombre_productos)
    .input("descripcion", sql.VarChar, req.body.descripcion)
    .input("stock_actual", sql.Int, req.body.stock_actual)
    .input("stock_minimo", sql.Int, req.body.stock_minimo)
    .input("descuento", sql.Decimal, req.body.descuento)
    .input("PrecioVenta", sql.Decimal, req.body.PrecioVenta)
    .input("id_categoria", sql.Int, req.body.id_categoria)
    .input("id_marca", sql.Int, req.body.id_marca)
    .query(
      `UPDATE inventario SET SKU = @SKU, nombre_productos = @nombre_productos, descripcion = @descripcion, 
       stock_actual = @stock_actual, stock_minimo = @stock_minimo, descuento = @descuento, 
       PrecioVenta = @PrecioVenta, id_categoria = @id_categoria, id_marca = @id_marca 
       WHERE id_producto = @id_producto`,
    );

  if (result.rowsAffected[0] == 0) {
    return res
      .status(404)
      .json({ message: "Producto no encontrado al momento de actualizar" });
  }

  return res.json({ message: "Producto actualizado correctamente" });
};

/**
 *
 * Obtener el listado de productos
 */
export const eliminarProducto = async (req: Request, res: Response) => {
  const pool = await getConnection();
  if (!pool) {
    return res
      .status(500)
      .json({ message: "No se ha establecido la conexion" });
  }

  const result = await pool
    .request()
    .input("id_producto", sql.Int, req.params.id_producto)
    .query("UPDATE inventario SET estado = 0 WHERE id_producto = @id_producto");

  if (result.rowsAffected[0] == 0) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  return res.json({ message: "Producto eliminado (soft delete)" });
};

/**
 *
 * Buscar un producto en la base de datos
 */
export const buscarProductos = async (req: Request, res: Response) => {
  const pool = await getConnection();
  if (!pool) {
    return res.status(500).json({ message: "Database connection error" });
  }

  const busqueda = req.params.busqueda;

  const result = await pool
    .request()
    .input("busqueda", sql.VarChar, `%${busqueda}%`)
    .query(
      `SELECT * FROM inventario 
       WHERE nombre_productos LIKE @busqueda OR descripcion LIKE @busqueda`,
    );

  return res.json(result.recordset);
};

/**
 * Obtener el listado de productos por categoria
 */
export const obtenerProductosPorCategoria = async (
  req: Request,
  res: Response,
) => {
  const pool = await getConnection();
  if (!pool) {
    return res.status(500).json({ message: "Database connection error" });
  }

  const result = await pool
    .request()
    .input("id_categoria", sql.Int, req.params.id_categoria)
    .query("SELECT * FROM inventario WHERE id_categoria = @id_categoria");

  return res.json(result.recordset);
};

/**
 * Obtener el listado de productos por marca
 */
export const obtenerProductosPorMarca = async (req: Request, res: Response) => {
  const pool = await getConnection();
  if (!pool) {
    return res.status(500).json({ message: "Database connection error" });
  }

  const result = await pool
    .request()
    .input("id_marca", sql.Int, req.params.id_marca)
    .query("SELECT * FROM inventario WHERE id_marca = @id_marca");

  return res.json(result.recordset);
};

/**
 * Obtener el listado de productos por rango de precios
 */
export const obtenerProductosPorRangoPrecio = async (
  req: Request,
  res: Response,
) => {
  const pool = await getConnection();
  if (!pool) {
    return res.status(500).json({ message: "Database connection error" });
  }

  const { precio_min, precio_max } = req.params;

  const result = await pool
    .request()
    .input("precio_min", sql.Decimal, precio_min)
    .input("precio_max", sql.Decimal, precio_max)
    .query(
      "SELECT * FROM inventario WHERE PrecioVenta BETWEEN @precio_min AND @precio_max",
    );

  return res.json(result.recordset);
};

/**
 * Obtener el listado de productos con descuento
 */
export const obtenerProductosConDescuento = async (
  req: Request,
  res: Response,
) => {
  const pool = await getConnection();
  if (!pool) {
    return res.status(500).json({ message: "Database connection error" });
  }

  const result = await pool
    .request()
    .query("SELECT * FROM inventario WHERE descuento > 0");

  return res.json(result.recordset);
};

/**
 * Obtener el listado de productos activos
 */
export const obtenerProductosActivos = async (req: Request, res: Response) => {
  const pool = await getConnection();
  if (!pool) {
    return res.status(500).json({ message: "Database connection error" });
  }

  const result = await pool
    .request()
    .query("SELECT * FROM inventario WHERE estado = 1");

  return res.json(result.recordset);
};

/**
 * Actualizar stock de un producto
 */
export const actualizarStock = async (req: Request, res: Response) => {
  const pool = await getConnection();
  if (!pool) {
    return res.status(500).json({ message: "Database connection error" });
  }

  const { stock_actual } = req.body;

  const result = await pool
    .request()
    .input("id_producto", sql.Int, req.params.id_producto)
    .input("stock_actual", sql.Int, stock_actual)
    .query(
      "UPDATE inventario SET stock_actual = @stock_actual WHERE id_producto = @id_producto",
    );

  if (result.rowsAffected[0] == 0) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  return res.json({ message: "Stock actualizado correctamente" });
};

/**
 * Obtener productos con bajo stock
 */
export const productosBajoStock = async (req: Request, res: Response) => {
  const pool = await getConnection();
  if (!pool) {
    return res.status(500).json({ message: "Database connection error" });
  }

  const result = await pool.request().query(
    `SELECT * FROM inventario 
       WHERE stock_actual <= stock_minimo AND stock_actual > 0`,
  );

  return res.json(result.recordset);
};

/**
 * Obtener productos sin stock
 */
export const productosSinStock = async (req: Request, res: Response) => {
  const pool = await getConnection();
  if (!pool) {
    return res.status(500).json({ message: "Database connection error" });
  }

  const result = await pool
    .request()
    .query("SELECT * FROM inventario WHERE stock_actual = 0");

  return res.json(result.recordset);
};

/**
 * Obtener productos con el nombre de la categoria
 */
export const obtenerProductoConCategoria = async (
  req: Request,
  res: Response,
) => {
  const pool = await getConnection();
  if (!pool) {
    return res.status(500).json({ message: "Database connection error" });
  }

  const result = await pool
    .request()
    .input("id_producto", sql.Int, req.params.id_producto)
    .query(
      `SELECT i.*, c.nombre_categoria 
       FROM inventario i 
       INNER JOIN categoria c ON i.id_categoria = c.id_categoria 
       WHERE i.id_producto = @id_producto`,
    );

  if (result.rowsAffected[0] === 0) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  return res.json(result.recordset[0]);
};

/**
 * Obtener productos con su marca
 */
export const obtenerProductoConMarca = async (req: Request, res: Response) => {
  const pool = await getConnection();
  if (!pool) {
    return res.status(500).json({ message: "Database connection error" });
  }

  const result = await pool
    .request()
    .input("id_producto", sql.Int, req.params.id_producto)
    .query(
      `SELECT i.*, m.nombre_marca 
       FROM inventario i 
       INNER JOIN marca m ON i.id_marca = m.id_marca 
       WHERE i.id_producto = @id_producto`,
    );

  if (result.rowsAffected[0] === 0) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  return res.json(result.recordset[0]);
};

/**
 * Obtener productos con su informacion completa
 */
export const obtenerProductoCompleto = async (req: Request, res: Response) => {
  const pool = await getConnection();
  if (!pool) {
    return res.status(500).json({ message: "Database connection error" });
  }

  const result = await pool
    .request()
    .input("id_producto", sql.Int, req.params.id_producto)
    .query(
      `SELECT i.*, c.nombre_categoria, m.nombre_marca 
       FROM inventario i 
       INNER JOIN categoria c ON i.id_categoria = c.id_categoria 
       INNER JOIN marca m ON i.id_marca = m.id_marca 
       WHERE i.id_producto = @id_producto`,
    );

  if (result.rowsAffected[0] === 0) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }

  return res.json(result.recordset[0]);
};
