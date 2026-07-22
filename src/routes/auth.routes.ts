import { Router } from "express";

import { registro, inicioSesion } from "../controllers/auth.controller";

const router = Router();

router.post("/auth/registro", registro);

router.post("/auth/login", inicioSesion);

export default router;
