const productoRepository = require('../repositories/productoRepository');

class ProductoService {
    async listarProductos() {
        return await productoRepository.obtenerTodos();
    }

    async obtenerProducto(id) {
        const producto = await productoRepository.obtenerPorId(id);
        if (!producto) {
            const error = new Error('Producto no encontrado');
            error.status = 404;
            throw error;
        }
        return producto;
    }

    async crearProducto(datosProducto) {
        // Regla 1: El stock actual no puede ser negativo
        if (datosProducto.stock_actual < 0) {
            const error = new Error('El stock inicial no puede ser un valor negativo');
            error.status = 400;
            throw error;
        }

        // Regla 2: El stock mínimo no puede superar al stock máximo
        if (Number(datosProducto.stock_minimo) >= Number(datosProducto.stock_maximo)) {
            const error = new Error('El stock mínimo no puede ser mayor o igual al stock máximo');
            error.status = 400;
            throw error;
        }

        // Regla 3: El stock inicial no puede superar el límite del stock máximo
        if (Number(datosProducto.stock_actual) > Number(datosProducto.stock_maximo)) {
            const error = new Error('El stock inicial no puede superar el límite del stock máximo configurado');
            error.status = 400;
            throw error;
        }

        return await productoRepository.crear(datosProducto);
    }
}

module.exports = new ProductoService();