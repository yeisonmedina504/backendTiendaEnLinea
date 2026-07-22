import express from "express";
import clientesRoutes from "./routes/clientes.routes";
import productosRoutes from "./routes/productos.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(express.json());
app.use(clientesRoutes);
app.use(productosRoutes);
app.use(authRoutes);

export default app;
