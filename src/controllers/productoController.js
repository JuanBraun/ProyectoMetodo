const productoService = require('../services/productoService');

class ProductoController {
    async getProductos(req, res, next) {
        try {
            const productos = await productoService.listarProductos();
            res.status(200).json(productos);
        } catch (error) {
            next(error);
        }
    }

    async getProductoById(req, res, next) {
        try {
            const producto = await productoService.obtenerProducto(req.params.id);
            res.status(200).json(producto);
        } catch (error) {
            next(error);
        }
    }

    async createProducto(req, res, next) {
        try {
            const nuevoProducto = await productoService.crearProducto(req.body);
            res.status(201).json(nuevoProducto);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProductoController();