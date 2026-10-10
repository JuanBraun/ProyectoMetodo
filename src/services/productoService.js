// src/services/productoService.js
const defaultRepository = require('../repositorios/repositorios');
const stockValidator = require('./stockValidator');
const stockAlertObserver = require('./observers/stockAlertObserver');

class ProductoService {
    // Inyección de dependencias (DIP): permite pasar un repositorio mock en tests
    constructor(repository = defaultRepository) {
        this.repository = repository;
        this.observers = [];
        
        // Suscribimos por defecto el observer de alertas
        this.suscribirObserver(stockAlertObserver);
    }

    suscribirObserver(observer) {
        this.observers.push(observer);
    }

    notificarObservers(producto) {
        this.observers.forEach(obs => obs.notificar(producto));
    }

    async listarProductos() {
        return await this.repository.obtenerTodos();
    }

    async obtenerProducto(id) {
        const producto = await this.repository.obtenerPorId(id);
        if (!producto) {
            const error = new Error('Producto no encontrado');
            error.status = 404;
            throw error;
        }
        return producto;
    }

    async crearProducto(datosProducto) {
        // Unificamos el contrato de datos (evita el bug de stock_max vs stock_maximo)
        const productoNormalizado = {
            ...datosProducto,
            stock_maximo: datosProducto.stock_maximo || datosProducto.stock_max
        };

        // 1. Delegamos validación (SRP)
        stockValidator.validarStockInicial(productoNormalizado);

        // 2. Persistimos a través de la abstracción inyectada (DIP)
        const nuevoProducto = await this.repository.crear(productoNormalizado);

        // 3. Notificamos a los observadores si requiere alerta (Observer Pattern)
        this.notificarObservers(nuevoProducto);

        return nuevoProducto;
    }
}

module.exports = new ProductoService();