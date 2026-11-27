import { API_BASE, fetchJson, mostrarAlerta } from './api.js';

let ubicacionesCache = [];
let ubicacionEditandoId = null;

export function getUbicacionesCache() {
    return ubicacionesCache;
}

export function renderizarTablaUbicaciones() {
    const tbody = document.getElementById('tablaUbicaciones');
    const termino = (document.getElementById('buscadorUbicaciones')?.value || '').trim();

    const filtradas = termino
        ? ubicacionesCache.filter(ubi => String(ubi.id).includes(termino))
        : ubicacionesCache;

    tbody.innerHTML = '';

    if (filtradas.length === 0) {
        const msg = termino
            ? 'No se encontraron ubicaciones con ese ID.'
            : 'No hay ubicaciones cargadas.';
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">${msg}</td></tr>`;
        return;
    }

    filtradas.forEach(ubi => {
        tbody.innerHTML += `
            <tr>
                <td>${ubi.id}</td>
                <td>${ubi.pasillo}</td>
                <td>${ubi.estante}</td>
                <td>${ubi.nivel}</td>
                <td class="text-muted">${ubi.descripcion || '-'}</td>
                <td class="text-end text-nowrap">
                    <button class="btn btn-sm btn-outline-secondary me-1" data-edit-ubi="${ubi.id}">Editar</button>
                    <button class="btn btn-sm btn-outline-danger" data-del-ubi="${ubi.id}">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

export async function cargarUbicaciones(onUpdateStats) {
    ubicacionesCache = await fetchJson(`${API_BASE}/ubicaciones`);
    const select = document.getElementById('ubicacion_id');
    const valorPrevio = select.value;

    select.innerHTML = '<option value="">-- Crear nueva ubicación abajo --</option>';
    ubicacionesCache.forEach(ubi => {
        select.innerHTML += `<option value="${ubi.id}">Pasillo ${ubi.pasillo} - Estante ${ubi.estante} - Nivel ${ubi.nivel}</option>`;
    });

    renderizarTablaUbicaciones();

    if (valorPrevio) select.value = valorPrevio;
    if (onUpdateStats) onUpdateStats();
}

function cargarParaEditar(id) {
    const ubi = ubicacionesCache.find(u => u.id === id);
    if (!ubi) return;

    ubicacionEditandoId = ubi.id;
    document.getElementById('ubiPasillo').value = ubi.pasillo;
    document.getElementById('ubiEstante').value = ubi.estante;
    document.getElementById('ubiNivel').value = ubi.nivel;
    document.getElementById('ubiDescripcion').value = ubi.descripcion || '';
    document.getElementById('ubiFormTitulo').textContent = `Editando Ubicación #${ubi.id}`;
    document.getElementById('btnUbiSubmit').textContent = 'Actualizar Ubicación';
    document.getElementById('btnUbiCancelar').classList.remove('d-none');
}

export function resetearFormularioUbicacion() {
    ubicacionEditandoId = null;
    document.getElementById('ubicacionForm').reset();
    document.getElementById('ubiFormTitulo').textContent = 'Nueva Ubicación';
    document.getElementById('btnUbiSubmit').textContent = 'Crear Ubicación';
    document.getElementById('btnUbiCancelar').classList.add('d-none');
}

async function eliminarUbicacion(id, onRefresh) {
    if (!confirm('¿Eliminar esta ubicación del depósito?')) return;
    try {
        await fetchJson(`${API_BASE}/ubicaciones/${id}`, { method: 'DELETE' });
        if (ubicacionEditandoId === id) resetearFormularioUbicacion();
        mostrarAlerta('Ubicación eliminada.');
        await onRefresh();
    } catch (error) {
        mostrarAlerta(error.message, 'danger');
    }
}

export function initUbicacionesEvents(onRefresh) {
    document.getElementById('buscadorUbicaciones').addEventListener('input', renderizarTablaUbicaciones);

    document.getElementById('ubicacionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            pasillo: document.getElementById('ubiPasillo').value.trim(),
            estante: document.getElementById('ubiEstante').value.trim(),
            nivel: document.getElementById('ubiNivel').value.trim(),
            descripcion: document.getElementById('ubiDescripcion').value.trim()
        };

        try {
            if (ubicacionEditandoId) {
                await fetchJson(`${API_BASE}/ubicaciones/${ubicacionEditandoId}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                });
                mostrarAlerta('Ubicación actualizada correctamente.');
            } else {
                await fetchJson(`${API_BASE}/ubicaciones`, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });
                mostrarAlerta('Ubicación creada correctamente.');
            }
            resetearFormularioUbicacion();
            await onRefresh();
        } catch (error) {
            mostrarAlerta(error.message, 'danger');
        }
    });

    document.getElementById('btnUbiCancelar').addEventListener('click', resetearFormularioUbicacion);

    document.getElementById('tablaUbicaciones').addEventListener('click', (e) => {
        const editId = e.target.dataset.editUbi;
        const delId = e.target.dataset.delUbi;
        if (editId) cargarParaEditar(Number(editId));
        if (delId) eliminarUbicacion(Number(delId), onRefresh);
    });
}