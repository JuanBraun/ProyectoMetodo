import express from "express";
import cors from "cors";
import productoRoutes from "./rutas/productoRutas.js";
import movimientoRoutes from "./rutas/movimientoRutas.js";
import categoriaRoutes from "./rutas/categoriaRutas.js";
import ubicacionRoutes from "./rutas/ubicacionRutas.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/productos", productoRoutes);
app.use("/api/movimientos", movimientoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/ubicaciones", ubicacionRoutes);

app.use(errorHandler);

export default app;
