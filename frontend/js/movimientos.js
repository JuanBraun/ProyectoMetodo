import { API_BASE, fetchJson, mostrarAlerta } from './api.js';
import { getProductosCache } from './productos.js';

export function poblarSelectorProductosMovimiento() {
    const select = document.getElementById('movProductoId');
    const valorPrevio = select.value;
    select.innerHTML = '<option value="">Seleccione un producto...</option>';
    getProductosCache().forEach(p => {
        select.innerHTML += `<option value="${p.id}">${p.nombre} (Stock actual: ${p.stock_actual})</option>`;
    });
    if (valorPrevio) select.value = valorPrevio;
}

export function irAMovimiento(productoId) {
    const tabTrigger = new bootstrap.Tab(document.getElementById('tab-movimientos-btn'));
    tabTrigger.show();
    const select = document.getElementById('movProductoId');
    select.value = productoId;
    cargarHistorialProducto(productoId);
}

export async function cargarHistorialProducto(productoId) {
    const tbody = document.getElementById('tablaHistorial');
    const subtitulo = document.getElementById('historialSubtitulo');

    if (!productoId) {
        subtitulo.textContent = 'Seleccioná un producto para ver su trazabilidad';
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-4">Sin producto seleccionado.</td></tr>';
        return;
    }

    const prod = getProductosCache().find(p => p.id === Number(productoId));
    subtitulo.textContent = prod ? `Producto: ${prod.nombre} | Stock actual: ${prod.stock_actual}` : '';

    try {
        const historial = await fetchJson(`${API_BASE}/movimientos/producto/${productoId}`);
        if (historial.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-4">Este producto aún no tiene movimientos registrados.</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        historial.forEach(mov => {
            const esIngreso = mov.tipo === 'INGRESO';
            const badgeTipo = esIngreso
                ? '<span class="badge bg-success-subtle text-success border border-success-subtle">INGRESO</span>'
                : '<span class="badge bg-danger-subtle text-danger border border-danger-subtle">EGRESO</span>';
            const fecha = mov.fecha ? new Date(mov.fecha).toLocaleString('es-AR') : '-';

            tbody.innerHTML += `
                <tr>
                    <td class="small">${fecha}</td>
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

export function initMovimientosEvents(onRefreshProductos) {
    document.getElementById('movProductoId').addEventListener('change', (e) => {
        cargarHistorialProducto(e.target.value);
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
            await cargarHistorialProducto(productoId);
        } catch (error) {
            mostrarAlerta(error.message, 'danger');
        }
    });
}