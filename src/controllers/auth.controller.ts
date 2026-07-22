import { Request, Response } from "express";
import { getConnection } from "../database/connections";
import sql from "mssql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt.config";

export const registro = async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      apellido,
      razon_social,
      identidad,
      RTN,
      fecha_nacimiento,
      telefono,
      direccion,
      email,
      contraseña,
    } = req.body;

    if (
      !nombre ||
      !apellido ||
      !identidad ||
      !RTN ||
      !contraseña ||
      !email ||
      !direccion
    ) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const pool = await getConnection();
    if (!pool) {
      return res
        .status(500)
        .json({ message: "Error de conexion a la base de datos" });
    }

    const existingEmail = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT id_cliente FROM clientes WHERE email = @email");

    if (existingEmail.recordset.length > 0) {
      return res.status(409).json({ message: "El email ya esta registrado" });
    }

    const existingIdentidad = await pool
      .request()
      .input("identidad", sql.VarChar, identidad)
      .query("SELECT id_cliente FROM clientes WHERE identidad = @identidad");

    if (existingIdentidad.recordset.length > 0) {
      return res.status(409).json({ message: "La identidad ya esta registrada" });
    }

    const existingRTN = await pool
      .request()
      .input("RTN", sql.VarChar, RTN)
      .query("SELECT id_cliente FROM clientes WHERE RTN = @RTN");

    if (existingRTN.recordset.length > 0) {
      return res.status(409).json({ message: "El RTN ya esta registrado" });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("apellido", sql.VarChar, apellido)
      .input("razon_social", sql.VarChar, razon_social || null)
      .input("identidad", sql.VarChar, identidad)
      .input("RTN", sql.VarChar, RTN || null)
      .input("fecha_nacimiento", sql.Date, fecha_nacimiento || null)
      .input("telefono", sql.VarChar, telefono || null)
      .input("direccion", sql.VarChar, direccion)
      .input("email", sql.VarChar, email)
      .input("contraseña", sql.VarChar, hashedPassword)
      .query(
        "INSERT INTO clientes(nombre, apellido, razon_social, identidad, RTN, fecha_nacimiento, telefono, direccion, email, contraseña) VALUES(@nombre, @apellido, @razon_social, @identidad, @RTN, @fecha_nacimiento, @telefono, @direccion, @email, @contraseña)",
      );

    return res
      .status(201)
      .json({ message: "Cliente registrado correctamente" });
  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).json({ message: "Error al registrar el cliente" });
  }
};

export const inicioSesion = async (req: Request, res: Response) => {
  try {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
      return res
        .status(400)
        .json({ message: "Email y contraseña son obligatorios" });
    }

    const pool = await getConnection();
    if (!pool) {
      return res
        .status(500)
        .json({ message: "Error de conexion a la base de datos" });
    }

    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM clientes WHERE email = @email");

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Credenciales invalidas" });
    }

    const cliente = result.recordset[0];

    const passwordMatch = await bcrypt.compare(contraseña, cliente.contraseña);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciales invalidas" });
    }

    const token = jwt.sign(
      { id_cliente: cliente.id_cliente, email: cliente.email },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn },
    );

    return res.json({
      message: "Inicio de sesion exitoso",
      token,
      cliente: {
        id_cliente: cliente.id_cliente,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        email: cliente.email,
      },
    });
  } catch (error) {
    console.error("Error en inicio de sesion:", error);
    return res.status(500).json({ message: "Error al iniciar sesion" });
  }
};
