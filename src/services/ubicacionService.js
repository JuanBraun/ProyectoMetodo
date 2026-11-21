const ubicacionRepository = require("../repositorios/ubicacionRepository");

class UbicacionService {
  async listarUbicaciones() {
    return await ubicacionRepository.obtenerTodas();
  }

  async obtenerUbicacion(id) {
    const ubicacion = await ubicacionRepository.obtenerPorId(id);
    if (!ubicacion) {
      const error = new Error("Ubicación no encontrada");
      error.status = 404;
      throw error;
    }
    return ubicacion;
  }

  async crearUbicacion(datos) {
    if (!datos.pasillo || !datos.estante || !datos.nivel) {
      const error = new Error(
        "Los campos pasillo, estante y nivel son obligatorios"
      );
      error.status = 400;
      throw error;
    }
    const resultado = await ubicacionRepository.crear(datos);
    return {
      id: resultado.insertId || resultado.id,
      ...datos
    };
  }

  async actualizarUbicacion(id, datos) {
    await this.obtenerUbicacion(id);
    if (!datos.pasillo || !datos.estante || !datos.nivel) {
      const error = new Error(
        "Los campos pasillo, estante y nivel son obligatorios"
      );
      error.status = 400;
      throw error;
    }
    return await ubicacionRepository.actualizar(id, datos);
  }

  async eliminarUbicacion(id) {
    await this.obtenerUbicacion(id);
    return await ubicacionRepository.eliminar(id);
  }
}

module.exports = new UbicacionService();