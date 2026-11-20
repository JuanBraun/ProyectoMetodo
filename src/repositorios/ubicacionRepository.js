const db = require("../config/database");

class UbicacionRepository {
  async obtenerTodas() {
    const [rows] = await db.query("SELECT * FROM ubicaciones");
    return rows;
  }

  async obtenerPorId(id) {
    const [rows] = await db.query("SELECT * FROM ubicaciones WHERE id = ?", [id]);
    return rows[0] || null;
  }

  async crear({ pasillo, estante, nivel, descripcion }) {
    const [result] = await db.query(
      "INSERT INTO ubicaciones (pasillo, estante, nivel, descripcion) VALUES (?, ?, ?, ?)",
      [pasillo, estante, nivel, descripcion],
    );
    return { id: result.insertId, pasillo, estante, nivel, descripcion };
  }

  async actualizar(id, { pasillo, estante, nivel, descripcion }) {
    await db.query(
      "UPDATE ubicaciones SET pasillo = ?, estante = ?, nivel = ?, descripcion = ? WHERE id = ?",
      [pasillo, estante, nivel, descripcion, id],
    );
    return { id: Number(id), pasillo, estante, nivel, descripcion };
  }

  async eliminar(id) {
    await db.query("DELETE FROM ubicaciones WHERE id = ?", [id]);
    return true;
  }
}

module.exports = new UbicacionRepository();