const express = require('express');
const productoRoutes = require('./rutas/productoRutas');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.use('/api/productos', productoRoutes);

app.use(errorHandler);

module.exports = app;