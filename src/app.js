const express = require("express");
const cors = require("cors");
const path = require("path");

const productoRoutes = require("./rutas/productoRutas");
const movimientoRoutes = require("./rutas/movimientoRutas");
const categoriaRoutes = require("./rutas/categoriaRutas");
const ubicacionRoutes = require("./rutas/ubicacionRutas");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api/productos", productoRoutes);
app.use("/api/movimientos", movimientoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/ubicaciones", ubicacionRoutes);

app.use(errorHandler);

module.exports = app