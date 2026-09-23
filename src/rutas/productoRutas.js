const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

router.get('/', productoController.getProductos);
router.get('/:id', productoController.getProductoById);
router.post('/', productoController.createProducto);

module.exports = router;