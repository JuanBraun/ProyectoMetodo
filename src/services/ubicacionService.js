const ubicacionRepository = require("../repositorios/ubicacionRepository");

class UbicacionService {
  async listarUbicaciones() {
    return await ubicacionRepository.obtenerTodas();
  }

  async crearUbicacion(datos) {
    if (!datos.pasillo || !datos.estante || !datos.nivel) {
      const error = new Error(
        "Los campos pasillo, estante y nivel son obligatorios",
      );
      error.status = 400;
      throw error;
    }
    return await ubicacionRepository.crear(datos);
  }
}

module.exports = new UbicacionService();
