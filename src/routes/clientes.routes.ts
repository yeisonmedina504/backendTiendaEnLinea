import { Router } from "express";
import {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from "../controllers/clientes.controllers";

const router = Router();

router.get("/clientes", obtenerClientes);
router.get("/clientes/:id_cliente", obtenerClientePorId);
router.post("/clientes", crearCliente);
router.put("/clientes/:id_cliente", actualizarCliente);
router.delete("/clientes/:id_cliente", eliminarCliente);

export default router;
