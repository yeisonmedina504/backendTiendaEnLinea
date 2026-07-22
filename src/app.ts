import express from "express";
import productosRoutes from "./routes/productos.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(express.json());
app.use(productosRoutes);
app.use(authRoutes);

export default app;
