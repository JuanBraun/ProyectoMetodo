import { API_BASE, fetchJson, mostrarAlerta } from './api.js';
import { getProductosCache } from './productos.js';

const estadoMovimientos = {
    page: 1,
    limit: 10,
    search: '',
    tipo: '',
    totalPages: 1
};

export function poblarSelectorProductosMovimiento() {
    const select = document.getElementById('movProductoId');
    const valorPrevio = select.value;
    select.innerHTML = '<option value="">Seleccione un producto...</option>';
    getProductosCache().forEach(p => {
        select.innerHTML += `<option value="${p.id}">${p.nombre} (Stock actual: ${p.stock_actual})</option>`;
    });
    if (valorPrevio) select.value = valorPrevio;
}

export async function cargarMovimientosPaginados() {
    const tbody = document.getElementById('tablaHistorial');
    const subtitulo = document.getElementById('historialSubtitulo');
    const totalBadge = document.getElementById('movTotalBadge');
    const paginacionInfo = document.getElementById('movPaginacionInfo');
    const btnPrev = document.getElementById('btnMovPrev');
    const btnNext = document.getElementById('btnMovNext');

    const params = new URLSearchParams({
        page: String(estadoMovimientos.page),
        limit: String(estadoMovimientos.limit)
    });

    if (estadoMovimientos.search.trim()) {
        params.append('search', estadoMovimientos.search.trim());
    }
    if (estadoMovimientos.tipo) {
        params.append('tipo', estadoMovimientos.tipo);
    }

    try {
        const data = await fetchJson(`${API_BASE}/movimientos?${params.toString()}`);
        const items = data.items || [];
        const meta = data.meta || { total: 0, page: 1, totalPages: 1 };

        estadoMovimientos.totalPages = meta.totalPages || 1;
        totalBadge.textContent = `${meta.total} registros`;
        paginacionInfo.textContent = `Página ${meta.page} de ${estadoMovimientos.totalPages}`;
        btnPrev.disabled = meta.page <= 1;
        btnNext.disabled = meta.page >= estadoMovimientos.totalPages;

        subtitulo.textContent = estadoMovimientos.search || estadoMovimientos.tipo
            ? 'Resultados filtrados'
            : 'Historial general de entradas y salidas';

        if (items.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No se encontraron movimientos con los filtros aplicados.</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        items.forEach(mov => {
            const esIngreso = mov.tipo === 'INGRESO';
            const badgeTipo = esIngreso
                ? '<span class="badge bg-success-subtle text-success border border-success-subtle">INGRESO</span>'
                : '<span class="badge bg-danger-subtle text-danger border border-danger-subtle">EGRESO</span>';
            const fecha = mov.fecha ? new Date(mov.fecha).toLocaleString('es-AR') : '-';
            const productoNombre = mov.producto_nombre || `Producto #${mov.producto_id}`;

            tbody.innerHTML += `
                <tr>
                    <td class="small">${fecha}</td>
                    <td class="fw-semibold">${productoNombre}</td>
                    <td>${badgeTipo}</td>
                    <td class="fw-bold">${esIngreso ? '+' : '-'}${mov.cantidad}</td>
                    <td class="text-muted">${mov.motivo || '-'}</td>
                </tr>
            `;
        });
    } catch (error) {
        mostrarAlerta(error.message, 'danger');
    }
}

export function irAMovimiento(productoId) {
    const tabTrigger = new bootstrap.Tab(document.getElementById('tab-movimientos-btn'));
    tabTrigger.show();
    const select = document.getElementById('movProductoId');
    select.value = productoId;
    cargarHistorialProducto(productoId);
}

export async function cargarHistorialProducto(productoId) {
    if (!productoId) {
        estadoMovimientos.search = '';
        estadoMovimientos.page = 1;
        document.getElementById('buscadorMovimientos').value = '';
        await cargarMovimientosPaginados();
        return;
    }

    const prod = getProductosCache().find(p => p.id === Number(productoId));
    if (prod) {
        estadoMovimientos.search = prod.nombre;
        estadoMovimientos.page = 1;
        document.getElementById('buscadorMovimientos').value = prod.nombre;
        await cargarMovimientosPaginados();
    }
}

export function initMovimientosEvents(onRefreshProductos) {
    let debounceTimer;

    document.getElementById('buscadorMovimientos').addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            estadoMovimientos.search = e.target.value;
            estadoMovimientos.page = 1;
            cargarMovimientosPaginados();
        }, 250);
    });

    document.getElementById('filtroTipoMovimiento').addEventListener('change', (e) => {
        estadoMovimientos.tipo = e.target.value;
        estadoMovimientos.page = 1;
        cargarMovimientosPaginados();
    });

    document.getElementById('limitMovimientos').addEventListener('change', (e) => {
        estadoMovimientos.limit = Number(e.target.value);
        estadoMovimientos.page = 1;
        cargarMovimientosPaginados();
    });

    document.getElementById('btnMovPrev').addEventListener('click', () => {
        if (estadoMovimientos.page > 1) {
            estadoMovimientos.page--;
            cargarMovimientosPaginados();
        }
    });

    document.getElementById('btnMovNext').addEventListener('click', () => {
        if (estadoMovimientos.page < estadoMovimientos.totalPages) {
            estadoMovimientos.page++;
            cargarMovimientosPaginados();
        }
    });

    document.getElementById('movimientoForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const productoId = parseInt(document.getElementById('movProductoId').value, 10);
        const payload = {
            producto_id: productoId,
            tipo: document.getElementById('movTipo').value,
            cantidad: parseInt(document.getElementById('movCantidad').value, 10),
            motivo: document.getElementById('movMotivo').value.trim()
        };

        try {
            const res = await fetchJson(`${API_BASE}/movimientos`, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            mostrarAlerta(`Movimiento registrado. Nuevo stock: ${res.nuevo_stock}`);
            document.getElementById('movCantidad').value = '';
            document.getElementById('movMotivo').value = '';
            await onRefreshProductos();
            document.getElementById('movProductoId').value = productoId;
            estadoMovimientos.page = 1;
            await cargarMovimientosPaginados();
        } catch (error) {
            mostrarAlerta(error.message, 'danger');
        }
    });

    cargarMovimientosPaginados();
}