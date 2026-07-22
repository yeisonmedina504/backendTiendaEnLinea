import { Request, Response } from "express";
import { getConnection } from "../database/connections";
import sql from "mssql";

export const obtenerClientes = async (req: Request, res: Response) => {
  const pool = await getConnection();
  if (!pool) {
    return res.status(500).json({ message: "Database connection error" });
  }
  const result = await pool.request().query("SELECT * FROM clientes");
  return res.json(result.recordset);
};

export const obtenerClientePorId = async (req: Request, res: Response) => {
  const pool = await getConnection();

  if (!pool) {
    return res.status(500).json({ message: "No se pudo acceder a la tabla" });
  }

  const result = await pool
    .request()
    .input("id_cliente", sql.Int, req.params.id_cliente)
    .query("SELECT * FROM clientes WHERE id_cliente = @id_cliente");

  if (result.rowsAffected[0] === 0) {
    return res.status(404).json({ message: "Cliente no encontrado" });
  }

  return res.json(result.recordset);
};

export const crearCliente = async (req: Request, res: Response) => {
  const pool = await getConnection();
  const result = await pool
    ?.request()
    .input("nombre", sql.VarChar, req.body.nombre)
    .input("apellido", sql.VarChar, req.body.apellido)
    .input("razon_social", sql.VarChar, req.body.razon_social)
    .input("identidad", sql.VarChar, req.body.identidad)
    .input("RTN", sql.VarChar, req.body.RTN)
    .input("fecha_nacimiento", sql.Date, req.body.fecha_nacimiento)
    .input("fecha_registro", sql.Date, req.body.fecha_registro)
    .input("telefono", sql.VarChar, req.body.telefono)
    .input("direccion", sql.VarChar, req.body.direccion)
    .input("email", sql.VarChar, req.body.email)
    .input("contraseña", sql.VarChar, req.body.contraseña)
    .query(
      "INSERT INTO clientes(nombre, apellido, razon_social, identidad, RTN, fecha_nacimiento, fecha_registro,telefono, direccion,email,contraseña) VALUES(@nombre, @apellido, @razon_social, @identidad, @RTN, @fecha_nacimiento, @fecha_registro, @telefono, @direccion, @email, @contraseña)",
    );
  res.send("Cliente creado exitosamente");
};

export const actualizarCliente = async (req: Request, res: Response) => {
  const pool = await getConnection();

  if (!pool) {
    return res
      .status(500)
      .json({ message: "No se ha establecido la conexion.." });
  }

  const result = await pool
    .request()
    .input("id_cliente", sql.Int, req.params.id_cliente)
    .input("nombre", sql.VarChar, req.body.nombre)
    .input("apellido", sql.VarChar, req.body.apellido)
    .input("razon_social", sql.VarChar, req.body.razon_social)
    .input("RTN", sql.VarChar, req.body.RTN)
    .input("fecha_nacimiento", sql.Date, req.body.fecha_nacimiento)
    .input("fecha_registro", sql.Date, req.body.fecha_registro)
    .input("telefono", sql.VarChar, req.body.telefono)
    .input("direccion", sql.VarChar, req.body.direccion)
    .input("email", sql.VarChar, req.body.email)
    .input("contraseña", sql.VarChar, req.body.contraseña)
    .query(
      "UPDATE clientes SET nombre = @nombre, apellido = @apellido, razon_social = @razon_social, RTN = @RTN, fecha_nacimiento = @fecha_nacimiento, fecha_registro = @fecha_registro, telefono = @telefono, direccion= @direccion, email = @email, contraseña = @contraseña WHERE id_cliente = @id_cliente",
    );

  if (result.rowsAffected[0] == 0) {
    return res
      .status(404)
      .json({ message: "Cliente no encontrado al momento de actualizar" });
  }

  return res.json({ message: "Cliente actualizado correctamente" });
};

export const eliminarCliente = async (req: Request, res: Response) => {
  const pool = await getConnection();

  if (!pool) {
    return res.status(500).json({ message: "No se ha establecido la conexion" });
  }

  const result = await pool
    ?.request()
    .input("id_cliente", sql.Int, req.params.id_cliente)
    .query("DELETE FROM clientes WHERE id_cliente = @id_cliente");

  if (result.rowsAffected[0] == 0) {
    return res.status(404).json({ message: "Cliente no encontrado" });
  }

  return res.json({ message: "Cliente eliminado" });
};
