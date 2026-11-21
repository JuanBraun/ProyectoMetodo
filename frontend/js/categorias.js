import { API_BASE, fetchJson, mostrarAlerta } from './api.js';

let categoriasCache = [];
let categoriaEditandoId = null;

export function getCategoriasCache() {
    return categoriasCache;
}

export async function cargarCategorias(onUpdateStats) {
    categoriasCache = await fetchJson(`${API_BASE}/categorias`);
    const select = document.getElementById('categoria_id');
    const tbody = document.getElementById('tablaCategorias');
    const valorPrevio = select.value;

    select.innerHTML = '<option value="">Sin categoría</option>';
    tbody.innerHTML = '';

    if (categoriasCache.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">No hay categorías cargadas.</td></tr>';
    }

    categoriasCache.forEach(cat => {
        select.innerHTML += `<option value="${cat.id}">${cat.nombre}</option>`;
        tbody.innerHTML += `
            <tr>
                <td>${cat.id}</td>
                <td class="fw-semibold">${cat.nombre}</td>
                <td class="text-muted">${cat.descripcion || '-'}</td>
                <td class="text-end text-nowrap">
                    <button class="btn btn-sm btn-outline-secondary me-1" data-edit-cat="${cat.id}">Editar</button>
                    <button class="btn btn-sm btn-outline-danger" data-del-cat="${cat.id}">Eliminar</button>
                </td>
            </tr>
        `;
    });

    if (valorPrevio) select.value = valorPrevio;
    if (onUpdateStats) onUpdateStats();
}

function cargarParaEditar(id) {
    const cat = categoriasCache.find(c => c.id === id);
    if (!cat) return;

    categoriaEditandoId = cat.id;
    document.getElementById('catNombre').value = cat.nombre;
    document.getElementById('catDescripcion').value = cat.descripcion || '';
    document.getElementById('catFormTitulo').textContent = `Editando: ${cat.nombre}`;
    document.getElementById('btnCatSubmit').textContent = 'Actualizar Categoría';
    document.getElementById('btnCatCancelar').classList.remove('d-none');
}

export function resetearFormularioCategoria() {
    categoriaEditandoId = null;
    document.getElementById('categoriaForm').reset();
    document.getElementById('catFormTitulo').textContent = 'Nueva Categoría';
    document.getElementById('btnCatSubmit').textContent = 'Crear Categoría';
    document.getElementById('btnCatCancelar').classList.add('d-none');
}

async function eliminarCategoria(id, onRefresh) {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
        await fetchJson(`${API_BASE}/categorias/${id}`, { method: 'DELETE' });
        if (categoriaEditandoId === id) resetearFormularioCategoria();
        mostrarAlerta('Categoría eliminada.');
        await onRefresh();
    } catch (error) {
        mostrarAlerta(error.message, 'danger');
    }
}

export function initCategoriasEvents(onRefresh) {
    document.getElementById('categoriaForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            nombre: document.getElementById('catNombre').value.trim(),
            descripcion: document.getElementById('catDescripcion').value.trim()
        };

        try {
            if (categoriaEditandoId) {
                await fetchJson(`${API_BASE}/categorias/${categoriaEditandoId}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                });
                mostrarAlerta('Categoría actualizada correctamente.');
            } else {
                await fetchJson(`${API_BASE}/categorias`, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                mostrarAlerta('Categoría creada correctamente.');
            }
            resetearFormularioCategoria();
            await onRefresh();
        } catch (error) {
            mostrarAlerta(error.message, 'danger');
        }
    });

    document.getElementById('btnCatCancelar').addEventListener('click', resetearFormularioCategoria);

    document.getElementById('tablaCategorias').addEventListener('click', (e) => {
        const editId = e.target.dataset.editCat;
        const delId = e.target.dataset.delCat;
        if (editId) cargarParaEditar(Number(editId));
        if (delId) eliminarCategoria(Number(delId), onRefresh);
    });
}