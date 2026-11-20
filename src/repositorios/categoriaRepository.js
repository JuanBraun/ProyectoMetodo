const db = require("../config/database");

class CategoriaRepository {
  async obtenerTodas() {
    const [rows] = await db.query("SELECT * FROM categorias");
    return rows;
  }

  async obtenerPorId(id) {
    const [rows] = await db.query("SELECT * FROM categorias WHERE id = ?", [id]);
    return rows[0] || null;
  }

  async crear({ nombre, descripcion }) {
    const [result] = await db.query(
      "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)",
      [nombre, descripcion],
    );
    return { id: result.insertId, nombre, descripcion };
  }

  async actualizar(id, { nombre, descripcion }) {
    await db.query(
      "UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?",
      [nombre, descripcion, id],
    );
    return { id: Number(id), nombre, descripcion };
  }

  async eliminar(id) {
    await db.query("DELETE FROM categorias WHERE id = ?", [id]);
    return true;
  }
}

module.exports = new CategoriaRepository();