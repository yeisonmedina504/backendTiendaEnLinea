import { Router } from "express";

import {
  obtenerProductos,
  obtenerProductosPorId,
  CreandoProductos,
  ActualizandoProductos,
  EliminandoProductos,
} from "../controllers/productos.controllers";

const router = Router();

router.get("/productos", obtenerProductos);

router.get("/productos/:id_cliente", obtenerProductosPorId);

router.post("/productos", CreandoProductos);

router.put("/productos/:id_cliente", ActualizandoProductos);

router.delete("/productos/:id_cliente", EliminandoProductos);

export default router;
