export const API_BASE = '/api';

export function mostrarAlerta(mensaje, tipo = 'success') {
    const alerta = document.getElementById('alertaGlobal');
    alerta.className = `alert alert-${tipo}`;
    alerta.textContent = mensaje;
    alerta.classList.remove('d-none');
    setTimeout(() => alerta.classList.add('d-none'), 4500);
}

export async function fetchJson(url, options = {}) {
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.error || data.mensaje || data.message || `Error HTTP ${response.status}`);
    }
    return data;
}