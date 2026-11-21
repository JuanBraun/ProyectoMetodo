const categoriaRepository = require("../repositorios/categoriaRepository");

class CategoriaService {
  async listarCategorias() {
    return await categoriaRepository.obtenerTodas();
  }

  async obtenerCategoria(id) {
    const categoria = await categoriaRepository.obtenerPorId(id);
    if (!categoria) {
      const error = new Error("Categoría no encontrada");
      error.status = 404;
      throw error;
    }
    return categoria;
  }

  async crearCategoria(datos) {
    if (!datos.nombre || datos.nombre.trim() === "") {
      const error = new Error("El nombre de la categoría es obligatorio");
      error.status = 400;
      throw error;
    }
    return await categoriaRepository.crear(datos);
  }

  async actualizarCategoria(id, datos) {
    await this.obtenerCategoria(id);
    if (!datos.nombre || datos.nombre.trim() === "") {
      const error = new Error("El nombre de la categoría es obligatorio");
      error.status = 400;
      throw error;
    }
    return await categoriaRepository.actualizar(id, datos);
  }

  async eliminarCategoria(id) {
    await this.obtenerCategoria(id);
    return await categoriaRepository.eliminar(id);
  }
}

module.exports = new CategoriaService();