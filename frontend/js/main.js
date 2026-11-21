import { mostrarAlerta } from './api.js';
import { cargarCategorias, getCategoriasCache, initCategoriasEvents } from './categorias.js';
import { cargarUbicaciones, getUbicacionesCache, initUbicacionesEvents } from './ubicaciones.js';
import { cargarProductos, getProductosCache, initProductosEvents } from './productos.js';
import { initMovimientosEvents, irAMovimiento, poblarSelectorProductosMovimiento } from './movimientos.js';

function actualizarEstadisticas() {
    const productos = getProductosCache();
    document.getElementById('statTotalProductos').textContent = productos.length;
    const bajos = productos.filter(p => Number(p.stock_actual) <= Number(p.stock_minimo)).length;
    document.getElementById('statStockBajo').textContent = bajos;
    document.getElementById('statCategorias').textContent = getCategoriasCache().length;
    document.getElementById('statUbicaciones').textContent = getUbicacionesCache().length;
}

async function refrescarTodo() {
    await Promise.all([
        cargarCategorias(actualizarEstadisticas),
        cargarUbicaciones(actualizarEstadisticas),
        cargarProductos(() => {
            actualizarEstadisticas();
            poblarSelectorProductosMovimiento();
        })
    ]);
}

async function inicializarApp() {
    initCategoriasEvents(refrescarTodo);
    initUbicacionesEvents(refrescarTodo);
    initProductosEvents({
        onRefreshAll: refrescarTodo,
        onIrAMovimiento: irAMovimiento
    });
    initMovimientosEvents(async () => {
        await cargarProductos(() => {
            actualizarEstadisticas();
            poblarSelectorProductosMovimiento();
        });
    });

    try {
        await refrescarTodo();
        const estado = document.getElementById('estadoConexion');
        estado.textContent = 'API Conectada';
        estado.className = 'text-success small fw-semibold';
    } catch (error) {
        const estado = document.getElementById('estadoConexion');
        estado.textContent = 'Sin conexión con el servidor';
        estado.className = 'text-danger small fw-semibold';
        mostrarAlerta('No se pudo conectar con el servidor. Verificá que "npm start" esté corriendo.', 'danger');
    }
}

inicializarApp();