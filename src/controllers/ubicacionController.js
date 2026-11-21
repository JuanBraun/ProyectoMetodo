const ubicacionService = require("../services/ubicacionService");

class UbicacionController {
  async getUbicaciones(req, res, next) {
    try {
      const ubicaciones = await ubicacionService.listarUbicaciones();
      res.status(200).json(ubicaciones);
    } catch (error) {
      next(error);
    }
  }

  async createUbicacion(req, res, next) {
    try {
      const nuevaUbicacion = await ubicacionService.crearUbicacion(req.body);
      res.status(201).json(nuevaUbicacion);
    } catch (error) {
      next(error);
    }
  }

  async updateUbicacion(req, res, next) {
    try {
      const ubicacionActualizada = await ubicacionService.actualizarUbicacion(
        req.params.id,
        req.body,
      );
      res.status(200).json(ubicacionActualizada);
    } catch (error) {
      next(error);
    }
  }

  async deleteUbicacion(req, res, next) {
    try {
      await ubicacionService.eliminarUbicacion(req.params.id);
      res.status(200).json({ mensaje: "Ubicación eliminada correctamente" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UbicacionController();