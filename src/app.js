const express = require("express");
const productoRoutes = require("./rutas/productoRutas");
const movimientoRoutes = require("./rutas/movimientoRutas");
const categoriaRoutes = require("./rutas/categoriaRutas");
const ubicacionRoutes = require("./rutas/ubicacionRutas");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

app.use("/api/productos", productoRoutes);
app.use("/api/movimientos", movimientoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/ubicaciones", ubicacionRoutes);

app.use(errorHandler);

module.exports = app;
