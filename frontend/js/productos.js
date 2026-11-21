import { API_BASE, fetchJson, mostrarAlerta } from './api.js';

let productosCache = [];
let productoEditandoId = null;

export function getProductosCache() {
    return productosCache;
}

export function toggleCamposNuevaUbicacion() {
    const ubicacionId = document.getElementById('ubicacion_id').value;
    const contenedor = document.getElementById('camposNuevaUbicacion');
    if (ubicacionId) {
        contenedor.classList.add('d-none');
        document.getElementById('pasillo').value = '';
        document.getElementById('estante').value = '';
        document.getElementById('nivel').value = '';
    } else {
        contenedor.classList.remove('d-none');
    }
}

export async function cargarProductos(onAfterLoad) {
    productosCache = await fetchJson(`${API_BASE}/productos`);
    renderizarTablaProductos();
    if (onAfterLoad) onAfterLoad();
}

export function renderizarTablaProductos() {
    const filtro = document.getElementById('buscadorProductos').value.toLowerCase().trim();
    const tbody = document.getElementById('tablaProductos');
    tbody.innerHTML = '';

    const filtrados = productosCache.filter(p =>
        p.nombre.toLowerCase().includes(filtro) ||
        (p.codigo_barras && p.codigo_barras.toLowerCase().includes(filtro))
    );

    if (filtrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No hay productos para mostrar.</td></tr>';
        return;
    }

    filtrados.forEach(prod => {
        const actual = Number(prod.stock_actual);
        const min = Number(prod.stock_minimo);
        const max = Number(prod.stock_max);

        let badge = '<span class="badge bg-success-subtle text-success border border-success-subtle badge-stock">Normal</span>';
        if (actual <= min) {
            badge = '<span class="badge bg-danger-subtle text-danger border border-danger-subtle badge-stock">Stock Bajo</span>';
        } else if (max > 0 && actual > max) {
            badge = '<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle badge-stock">Exceso</span>';
        }

        tbody.innerHTML += `
            <tr>
                <td>
                    <div class="fw-semibold">${prod.nombre}</div>
                    <div class="text-muted small">${prod.codigo_barras || 'Sin código'}</div>
                </td>
                <td>$${Number(prod.precio_venta).toFixed(2)}</td>
                <td>
                    <span class="fw-bold">${actual}</span>
                    <span class="text-muted small">(${min} / ${max})</span>
                </td>
                <td>${badge}</td>
                <td class="text-end text-nowrap">
                    <button class="btn btn-sm btn-outline-dark me-1" data-stock-prod="${prod.id}">Stock</button>
                    <button class="btn btn-sm btn-outline-secondary me-1" data-edit-prod="${prod.id}">Editar</button>
                    <button class="btn btn-sm btn-outline-danger" data-del-prod="${prod.id}">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

function cargarParaEditar(id) {
    const prod = productosCache.find(p => p.id === id);
    if (!prod) return;

    productoEditandoId = prod.id;
    document.getElementById('codigo_barras').value = prod.codigo_barras || '';
    document.getElementById('nombre').value = prod.nombre;
    document.getElementById('descripcion').value = prod.descripcion || '';
    document.getElementById('precio_venta').value = prod.precio_venta;
    document.getElementById('stock_actual').value = prod.stock_actual;
    document.getElementById('stock_minimo').value = prod.stock_minimo;
    document.getElementById('stock_max').value = prod.stock_max;
    document.getElementById('categoria_id').value = prod.categoria_id || '';
    document.getElementById('ubicacion_id').value = prod.ubicacion_id || '';
    toggleCamposNuevaUbicacion();

    document.getElementById('formTitulo').textContent = `Editando: ${prod.nombre}`;
    document.getElementById('btnSubmit').textContent = 'Actualizar Producto';
    document.getElementById('btnCancelar').classList.remove('d-none');
}

export function resetearFormularioProducto() {
    productoEditandoId = null;
    document.getElementById('productoForm').reset();
    document.getElementById('stock_minimo').value = 1;
    toggleCamposNuevaUbicacion();
    document.getElementById('formTitulo').textContent = 'Nuevo Producto';
    document.getElementById('btnSubmit').textContent = 'Guardar Producto';
    document.getElementById('btnCancelar').classList.add('d-none');
}

async function eliminarProducto(id, onRefresh) {
    if (!confirm('¿Eliminar este producto del inventario?')) return;
    try {
        await fetchJson(`${API_BASE}/productos/${id}`, { method: 'DELETE' });
        if (productoEditandoId === id) resetearFormularioProducto();
        mostrarAlerta('Producto eliminado.');
        await onRefresh();
    } catch (error) {
        mostrarAlerta(error.message, 'danger');
    }
}

export function initProductosEvents({ onRefreshAll, onIrAMovimiento }) {
    document.getElementById('ubicacion_id').addEventListener('change', toggleCamposNuevaUbicacion);
    document.getElementById('buscadorProductos').addEventListener('input', renderizarTablaProductos);
    document.getElementById('btnCancelar').addEventListener('click', resetearFormularioProducto);

    document.getElementById('productoForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const ubicacionId = document.getElementById('ubicacion_id').value;
        const categoriaId = document.getElementById('categoria_id').value;
        const codigoBarras = document.getElementById('codigo_barras').value.trim();

        const datosProducto = {
            codigo_barras: codigoBarras || null,
            nombre: document.getElementById('nombre').value.trim(),
            descripcion: document.getElementById('descripcion').value.trim(),
            precio_venta: parseFloat(document.getElementById('precio_venta').value),
            stock_actual: parseInt(document.getElementById('stock_actual').value, 10),
            stock_minimo: parseInt(document.getElementById('stock_minimo').value, 10),
            stock_max: parseInt(document.getElementById('stock_max').value, 10),
            categoria_id: categoriaId ? parseInt(categoriaId, 10) : null,
            ubicacion_id: ubicacionId ? parseInt(ubicacionId, 10) : null
        };

        if (!ubicacionId) {
            const pasillo = document.getElementById('pasillo').value.trim();
            const estante = document.getElementById('estante').value.trim();
            const nivel = document.getElementById('nivel').value.trim();
            if (pasillo && estante && nivel) {
                datosProducto.pasillo = pasillo;
                datosProducto.estante = estante;
                datosProducto.nivel = nivel;
            }
        }

        try {
            if (productoEditandoId) {
                await fetchJson(`${API_BASE}/productos/${productoEditandoId}`, {
                    method: 'PUT',
                    body: JSON.stringify(datosProducto)
                });
                mostrarAlerta('Producto actualizado correctamente.');
            } else {
                await fetchJson(`${API_BASE}/productos`, {
                    method: 'POST',
                    body: JSON.stringify(datosProducto)
                });
                mostrarAlerta('Producto registrado correctamente.');
            }
            resetearFormularioProducto();
            await onRefreshAll();
        } catch (error) {
            mostrarAlerta(error.message, 'danger');
        }
    });

    document.getElementById('tablaProductos').addEventListener('click', (e) => {
        const stockId = e.target.dataset.stockProd;
        const editId = e.target.dataset.editProd;
        const delId = e.target.dataset.delProd;
        if (stockId) onIrAMovimiento(Number(stockId));
        if (editId) cargarParaEditar(Number(editId));
        if (delId) eliminarProducto(Number(delId), onRefreshAll);
    });
}